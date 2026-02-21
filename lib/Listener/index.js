// File: lib/Listener/index.js
// Module: Chatify Framework

const Messages = require('./Messages');
const Participants = require('./Participants');
const Groups = require('./Groups');
const Call = require('./Call');

/**
 * Event Listener Loader
 * Menghubungkan Socket Baileys ke file listener spesifik
 */
module.exports = (sock, emit) => {
    // 1. Handle Pesan
    sock.ev.on('messages.upsert', ({ messages }) => {
        Messages(sock, messages, emit);
    });

    // 2. Handle Peserta Grup
    sock.ev.on('group-participants.update', (ev) => {
        Participants(sock, ev, emit);
    });

    // 3. Handle Update Grup
    sock.ev.on('groups.update', (update) => {
        Groups(sock, update, emit);
    });

    // 4. Handle Call
    sock.ev.on('call', (calls) => {
        Call(sock, calls, emit);
    });

    // 5. Handle Presence (Typing/Online)
    sock.ev.on('presence.update', (ev) => {
        emit('presence.update', ev, sock);
    });
};