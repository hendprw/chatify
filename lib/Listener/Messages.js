// File: lib/Listener/Messages.js
// Module: Chatify Framework

const { serialize } = require('../Core/Serializer');
const { msgSchema } = require('../Utils/Schema');

module.exports = async (sock, messages, emit) => {
    try {
        let m = messages[0];
        if (!m.message) return;
        if (m.key.fromMe) return;

        // Normalisasi dan Serialisasi
        const msgObject = msgSchema(m);
        const mEnhanced = await serialize(sock, msgObject);

        // Emit ke user framework
        emit('message', mEnhanced, sock);
    } catch (e) {
        console.error('[Listener.Messages] Error:', e);
    }
};