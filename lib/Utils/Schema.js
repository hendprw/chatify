// File: lib/Utils/Schema.js
// Module: Chatify Framework

// const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const { jidNormalizedUser, proto } = require('@whiskeysockets/baileys');
/**
 * Normalisasi format pesan (Factory Pattern)
 */
const msgSchema = (m) => {
    if (!m) return m;
    let M = proto.WebMessageInfo.fromObject(m);
    if (M.key) {
        M.id = M.key.id;
        M.isSelf = M.key.fromMe;
        M.from = M.key.remoteJid;
        M.isGroup = M.from.endsWith('@g.us');
        M.sender = jidNormalizedUser(M.isGroup ? M.key.participant : M.from);
    }
    return M;
};

module.exports = { msgSchema };