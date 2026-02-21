// File: lib/Listener/Participants.js
// Module: Chatify Framework

module.exports = async (sock, ev, emit) => {
    try {
        const { id, participants, action } = ev;
        
        // Logika sederhana untuk menyapa (Bisa dikembangkan user)
        console.log(`[Group Update] ${id} - Action: ${action} - Participants: ${participants.join(', ')}`);
        
        // Emit agar bisa ditangkap di sisi user
        emit('group-participants', ev, sock);
    } catch (e) {
        console.error('[Listener.Participants] Error:', e);
    }
};