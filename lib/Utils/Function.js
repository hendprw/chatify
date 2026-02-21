// File: lib/Utils/Function.js
// Module: Chatify Framework
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { USER_AGENT } = require('./Constants');

/**
 * Tidur/Jeda eksekusi
 * @param {Number} ms - Milidetik
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Ambil Buffer dari URL
 * @param {String} url 
 * @param {Object} options 
 */
const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: { 'User-Agent': USER_AGENT, ...options.headers },
            responseType: 'arraybuffer',
            ...options
        });
        return {
            status: res.status,
            result: res.data,
            headers: res.headers
        };
    } catch (e) {
        throw e;
    }
};

/**
 * Acak angka/string
 */
const getRandom = (ext = '', length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return ext ? `${result}.${ext}` : result;
};

/**
 * Cek apakah string adalah URL valid
 */
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
};

/**
 * Konversi Ukuran File
 */
const formatSize = (bytes) => {
    if (bytes >= 1000000000) { bytes = (bytes / 1000000000).toFixed(2) + ' GB'; }
    else if (bytes >= 1000000) { bytes = (bytes / 1000000).toFixed(2) + ' MB'; }
    else if (bytes >= 1000) { bytes = (bytes / 1000).toFixed(2) + ' KB'; }
    else if (bytes > 1) { bytes = bytes + ' bytes'; }
    else if (bytes == 1) { bytes = bytes + ' byte'; }
    else { bytes = '0 bytes'; }
    return bytes;
};

module.exports = {
    sleep,
    getBuffer,
    getRandom,
    isUrl,
    formatSize
};