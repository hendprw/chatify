// File: lib/Adapter/Store.js
// Module: Chatify Framework

const { makeInMemoryStore } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const logger = require('../Utils/Logger');

// Path file untuk backup store (agar saat restart data chat tidak hilang total)
const storeFile = path.join(__dirname, '../../store.json');

const store = makeInMemoryStore({ 
    logger: logger.child({ level: 'silent', stream: 'store' }) 
});

// Fungsi Auto-Save Store setiap 10 detik
const bind = (sock) => {
    store.bind(sock.ev);
    
    setInterval(() => {
        store.writeToFile(storeFile);
    }, 10 * 1000);
};

// Load store dari file jika ada
const load = () => {
    if (fs.existsSync(storeFile)) {
        store.readFromFile(storeFile);
    }
};

load();

module.exports = { store, bind };