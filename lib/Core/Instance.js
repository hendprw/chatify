// File: lib/Core/Instance.js
// Module: Chatify Framework

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const Connection = require('./Connection');
const Node = require('./Node');
const Listener = require('../Listener');

class Chatify extends EventEmitter {
    constructor(options = {}) {
        super();
        this.connection = new Connection(options);
        this.sock = null;
        this.node = null;
        
        // Map untuk menyimpan data plugin di dalam memori
        this.plugins = new Map(); 
    }

    /**
     * Memuat plugin dari direktori yang ditentukan dan memantau perubahannya (Hot-Reload)
     * @param {string} dirPath - Path absolut menuju folder plugin
     */
    loadPlugins(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`[Chatify] Membuat direktori plugin di: ${dirPath}`);
        }

        // Fungsi internal untuk memuat/memuat ulang 1 file plugin
        const loadFile = (filename) => {
            const fullPath = path.join(dirPath, filename);
            try {
                // Hapus cache agar saat diedit, file baru yang dibaca
                delete require.cache[require.resolve(fullPath)];
                
                const plugin = require(fullPath);
                
                // Validasi struktur standar plugin
                if (plugin.name && typeof plugin.execute === 'function') {
                    this.plugins.set(plugin.name, plugin);
                    return true;
                }
            } catch (e) {
                console.error(`[Chatify] Gagal memuat plugin ${filename}:`, e.message);
            }
            return false;
        };

        // 1. Muat semua file saat bot pertama kali dijalankan
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
        let loadedCount = 0;
        for (const file of files) {
            if (loadFile(file)) loadedCount++;
        }
        console.log(`[Chatify] Berhasil memuat ${loadedCount} plugin dari ${dirPath}`);

        // 2. Pasang Watcher untuk Hot-Reloading
        fs.watch(dirPath, (eventType, filename) => {
            if (filename && filename.endsWith('.js')) {
                // Beri sedikit delay untuk memastikan file selesai di-save oleh OS
                setTimeout(() => {
                    if (loadFile(filename)) {
                        console.log(`[Hot-Reload] Plugin '${filename}' berhasil diperbarui!`);
                    }
                }, 100); 
            }
        });
    }

    async start() {
        this.sock = await this.connection.connect();
        this.node = new Node(this.sock);

// --- COMMAND HANDLER & MIDDLEWARE ---
        this.on('message', async (m, sock) => {
            // 1. Ekstrak tipe pesan WhatsApp
            const type = m.message ? Object.keys(m.message)[0] : '';
            
            // 2. Ambil teks asli dari Baileys (menangani chat biasa, balasan/quote, dan caption gambar)
            const rawText = m.message?.conversation || 
                            m.message?.[type]?.text || 
                            m.message?.[type]?.caption || 
                            m.message?.[type]?.selectedDisplayText || '';

            // 3. Gabungkan dengan hasil Serializer (jika ada)
            const body = m.body || m.text || rawText || ''; 
            
            // --- TAMBAHKAN LOG INI AGAR TERMINAL TIDAK SEPI ---
            if (body) {
                const senderId = m.key.participant || m.key.remoteJid;
                console.log(`[📩 Pesan] Dari ${senderId.split('@')[0]}: "${body}"`);
            }
            
            // Deteksi prefix (mendukung awalan: \ / ! # .)
            const prefixMatch = /^[\\/!#.]/.exec(body);
            const prefix = prefixMatch ? prefixMatch[0] : null;
            
            // Abaikan jika tidak memakai prefix
            if (!prefix) return; 

            // Parsing argumen dan nama command
            const args = body.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const text = args.join(' ');

            // Cari plugin berdasarkan nama...
            let plugin = this.plugins.get(commandName);
            // ...atau cari berdasarkan aliasnya jika nama utama tidak cocok
            if (!plugin) {
                for (const [, p] of this.plugins) {
                    if (p.aliases && p.aliases.includes(commandName)) {
                        plugin = p;
                        break;
                    }
                }
            }

            // Jika ada plugin yang cocok dengan perintah
            if (plugin) {
                try {
                    // --- Eksekusi Middleware ---
                    const isGroup = m.key.remoteJid.endsWith('@g.us');
                    const sender = m.key.participant || m.key.remoteJid;
                    
                    if (plugin.isGroup && !isGroup) {
                        return sock.sendMessage(m.key.remoteJid, { text: '❌ Perintah ini hanya bisa digunakan di dalam grup.' }, { quoted: m });
                    }
                    if (plugin.isPrivate && isGroup) {
                        return sock.sendMessage(m.key.remoteJid, { text: '❌ Perintah ini hanya bisa digunakan lewat chat pribadi (PC).' }, { quoted: m });
                    }
                    // Anda bisa menambahkan middleware lain di sini (misal: isOwner, premiumOnly, isBotAdmin, dll)

                    // --- Eksekusi Utama Plugin ---
                    // Mengirimkan objek lengkap agar mudah diakses dari dalam plugin
                    await plugin.execute(m, sock, { 
                        args, 
                        text, 
                        prefix, 
                        command: commandName, 
                        isGroup, 
                        sender 
                    });

                } catch (err) {
                    console.error(`[Plugin Error - ${plugin.name}]:`, err);
                    await sock.sendMessage(m.key.remoteJid, { 
                        text: `⚠️ Terjadi kesalahan internal saat mengeksekusi perintah *${prefix}${commandName}*.` 
                    }, { quoted: m });
                }
            }
        });

        // Teruskan (pass-through) event dari Baileys ke luar instance
        Listener(this.sock, (event, data, sock) => {
            this.emit(event, data, sock);
        });

        return this.sock;
    }
}

module.exports = Chatify;