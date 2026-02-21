// File: lib/Core/Message.js
// Module: Chatify Framework

const { getContentType, jidNormalizedUser } = require('@whiskeysockets/baileys');

class Message {
    constructor(sock, m) {
        this.sock = sock;
        this.key = m.key;
        this.id = m.key.id;
        this.from = m.key.remoteJid;
        this.isGroup = this.from.endsWith('@g.us');
        this.isSelf = m.key.fromMe;
        this.sender = jidNormalizedUser(this.isGroup ? m.key.participant : this.from);
        this.pushName = m.pushName;

        if (m.message) {
            this.type = getContentType(m.message);
            if (this.type === 'ephemeralMessage' || this.type === 'viewOnceMessage') {
                this.msg = m.message[this.type].message;
                this.type = getContentType(this.msg);
            } else {
                this.msg = m.message[this.type];
            }

            this.body = (this.type === 'conversation') ? this.msg :
                        (this.type === 'imageMessage' || this.type === 'videoMessage') ? this.msg.caption :
                        (this.type === 'extendedTextMessage') ? this.msg.text : '';
        }
    }
}

module.exports = Message;