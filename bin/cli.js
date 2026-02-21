#!/usr/bin/env node
// Baris di atas (shebang) WAJIB ada agar OS tahu ini dieksekusi dengan Node.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ambil argumen nama project (npx create-chatify <nama-project>)
const projectName = process.argv[2] || 'chatify-bot';
const targetPath = path.join(process.cwd(), projectName);

console.log(`🚀 Membuat project Chatify baru di: ${targetPath}...`);

// 1. Buat direktori project
if (fs.existsSync(targetPath)) {
    console.error(`❌ Folder "${projectName}" sudah ada. Silakan gunakan nama lain.`);
    process.exit(1);
}
fs.mkdirSync(targetPath, { recursive: true });

// 2. Buat package.json untuk project user
const packageJson = {
    name: projectName,
    version: "1.0.0",
    description: "WhatsApp Bot powered by Chatify.js",
    main: "index.js",
    scripts: {
        "start": "node index.js"
    },
    dependencies: {
        // Asumsi nama package Anda di NPM adalah "chatify-js"
        "chatify-js": "^1.0.0" 
    }
};

fs.writeFileSync(
    path.join(targetPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
);

// 3. Buat file index.js (Entry Point)
const indexJsContent = `const path = require('path');
const { Chatify } = require('chatify-js');

const bot = new Chatify({ 
    session: 'session-auth', // Folder untuk menyimpan sesi Baileys
    online: true,
    browser: ['${projectName}', 'macOS', '3.0.0']
});

// Load semua plugin dari folder 'plugins'
bot.loadPlugins(path.join(__dirname, 'plugins'));

// Mulai koneksi bot
bot.start();
`;

fs.writeFileSync(path.join(targetPath, 'index.js'), indexJsContent);

// 4. Buat folder plugins dan 1 contoh plugin dasar
const pluginsPath = path.join(targetPath, 'plugins');
fs.mkdirSync(pluginsPath);

const pingPluginContent = `module.exports = {
    name: 'ping',
    aliases: ['p', 'test'],
    isGroup: false,
    desc: 'Cek status respon bot',
    
    execute: async (m, sock) => {
        await sock.sendMessage(m.key.remoteJid, { 
            text: '🏓 *Pong!*\nChatify bot berjalan dengan lancar.' 
        }, { quoted: m });
    }
};
`;

fs.writeFileSync(path.join(pluginsPath, 'ping.js'), pingPluginContent);

console.log(`\n✅ Selesai! Project berhasil di-generate.`);
console.log(`\nSelanjutnya, jalankan perintah berikut:`);
console.log(`\x1b[36m  cd ${projectName}\x1b[0m`);
console.log(`\x1b[36m  npm install\x1b[0m`);
console.log(`\x1b[36m  npm start\x1b[0m\n`);