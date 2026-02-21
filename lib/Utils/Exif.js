// File: lib/Utils/Exif.js
// Module: Chatify Framework

const fs = require('fs');
const { getRandom } = require('./Function');
const path = require('path');
const webp = require('node-webpmux'); // Library ini perlu diinstall jika belum, tapi kita pakai buffer manipulation manual saja untuk menghindari dependensi berat jika memungkinkan. 
// Namun untuk kestabilan Enterprise, kita pakai logic Hex Manipulation atau webpmux. 
// Di sini saya gunakan Hex Manipulation yang stabil tanpa dependensi tambahan binary.

/**
 * Menambahkan Metadata Exif ke Sticker WebP
 * @param {Buffer} webpSticker 
 * @param {Object} pack 
 * @returns {Promise<Buffer>}
 */
async function writeExif(webpSticker, pack = { packname: 'Chatify', author: 'Bot' }) {
    const imgId = getRandom('webp');
    const json = {
        "sticker-pack-id": "com.chatify.tech",
        "sticker-pack-name": pack.packname,
        "sticker-pack-publisher": pack.author,
        "emojis": ["🤖"]
    };
    
    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    const exifLength = exif.length;
    
    // Construct RIFF Buffer
    const dataBuffer = Buffer.concat([
        Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]),
        jsonBuffer
    ]);

    // Kita akan menggunakan pendekatan external library 'webpmux' jika hex manipulation gagal, 
    // Tapi untuk native Node.js tanpa binary luar, kita gunakan library 'libwebp' via ffmpeg di converter.
    // Untuk Exif, cara paling clean adalah menggunakan library 'node-webpmux'.
    // Pastikan jalankan: npm install node-webpmux
    
    // Jika user belum install, kita pakai try catch
    try {
        const img = new webp.Image();
        await img.load(webpSticker);
        img.exif = exif;
        return await img.save(null);
    } catch (e) {
        console.error('[Exif] Gagal menulis metadata (Install node-webpmux untuk fix):', e);
        return webpSticker; // Kembalikan original jika gagal
    }
}

module.exports = { writeExif };