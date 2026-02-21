// File: chatify/index.js

const Chatify = require('./lib/Core/Instance');
const Functions = require('./lib/Utils/Function');

module.exports = {
    Chatify,       // Mengekspor class utama agar bisa dipanggil dengan 'new Chatify()'
    ...Functions   // Tetap mengekspor fungsi-fungsi utilitas bawaan Anda
};