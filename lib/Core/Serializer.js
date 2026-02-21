// File: lib/Core/Serializer.js
// Module: Chatify Framework

const { getContentType, jidNormalizedUser, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');

async function downloadMedia(message, type) {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

async function serialize(conn, m) {
    if (!m) return m;

    m.reply = async (text, options = {}) => {
        return await conn.sendMessage(m.from, { text, ...options }, { quoted: m });
    };

    m.react = async (emoji) => {
        return await conn.sendMessage(m.from, { react: { text: emoji, key: m.key } });
    };

    m.download = async () => {
        const type = m.type.replace('Message', '');
        return await downloadMedia(m.msg, type);
    };

    m.delete = async () => {
        return await conn.sendMessage(m.from, { delete: m.key });
    };

    if (m.msg && m.msg.contextInfo && m.msg.contextInfo.quotedMessage) {
        m.quoted = {};
        m.quoted.type = getContentType(m.msg.contextInfo.quotedMessage);
        m.quoted.msg = m.msg.contextInfo.quotedMessage[m.quoted.type];
        m.quoted.id = m.msg.contextInfo.stanzaId;
        m.quoted.sender = jidNormalizedUser(m.msg.contextInfo.participant);
        
        m.quoted.download = async () => {
            const type = m.quoted.type.replace('Message', '');
            return await downloadMedia(m.quoted.msg, type);
        };
    }

    return m;
}

module.exports = { serialize };