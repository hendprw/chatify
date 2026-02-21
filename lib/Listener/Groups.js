// File: lib/Listener/Groups.js
// Module: Chatify Framework

module.exports = async (sock, update, emit) => {
    try {
        emit('groups.update', update, sock);
    } catch (e) {
        console.error('[Listener.Groups] Error:', e);
    }
};