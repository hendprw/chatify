// File: lib/Core/Connection.js
// Module: Chatify Framework

const { 
    default: makeWASocket, 
    fetchLatestBaileysVersion, 
    DisconnectReason,
    proto
} = require('@whiskeysockets/baileys');
const logger = require('../Utils/Logger');
const State = require('./State');
const { store, bind } = require('../Adapter/Store');

class Connection {
    constructor(options = {}) {
        this.options = {
            session: 'session',
            online: true,
            browser: ['Chatify', 'macOS', '3.0.0'],
            type: 'json',
            url: '',
            ...options
        };
        this.sock = null;
    }

    async connect() {
        const stateLogic = new State(this.options.session, this.options.type, this.options.url);
        const { state, saveCreds } = await stateLogic.get();
        const { version } = await fetchLatestBaileysVersion();

        this.sock = makeWASocket({
            version,
            logger,
            printQRInTerminal: true,
            auth: state,
            browser: this.options.browser,
            markOnlineOnConnect: this.options.online,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg?.message || undefined;
                }
                return proto.Message.fromObject({});
            }
        });

        bind(this.sock);

        this.sock.ev.on('creds.update', saveCreds);

        this.sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const code = lastDisconnect.error?.output?.statusCode;
                const shouldReconnect = code !== DisconnectReason.loggedOut;
                console.log(`[Connection] Closed. Reason: ${code}, Reconnecting: ${shouldReconnect}`);
                if (shouldReconnect) this.connect();
            } else if (connection === 'open') {
                console.log(`[Connection] Connected as ${this.sock.user.id.split(':')[0]}`);
            }
        });

        return this.sock;
    }
}

module.exports = Connection;