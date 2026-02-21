// File: lib/Utils/Constants.js
// Module: Chatify Framework

module.exports = {
    // User Agent untuk Request Netral
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    // Header Standar WhatsApp
    WA_HEADERS: {
        'Origin': 'https://web.whatsapp.com',
        'Referer': 'https://web.whatsapp.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },

    // Tipe Pesan
    MSG_TYPE: {
        text: 'conversation',
        image: 'imageMessage',
        video: 'videoMessage',
        sticker: 'stickerMessage',
        audio: 'audioMessage',
        document: 'documentMessage',
        location: 'locationMessage',
        contact: 'contactMessage',
        poll: 'pollCreationMessage'
    }
};