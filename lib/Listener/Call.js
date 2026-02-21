// File: lib/Listener/Call.js
// Module: Chatify Framework

module.exports = async (sock, calls, emit) => {
    try {
        for (const call of calls) {
            if (call.status === 'offer') {
                console.log(`[Call] Incoming call from ${call.from}`);
                // Reject call otomatis (Enterprise Standard)
                await sock.rejectCall(call.id, call.from);
                
                // Beri tahu user via chat
                await sock.sendMessage(call.from, { 
                    text: 'Maaf, bot tidak dapat menerima panggilan telepon. Silakan kirim pesan teks.' 
                });
            }
        }
    } catch (e) {
        console.error('[Listener.Call] Error:', e);
    }
};