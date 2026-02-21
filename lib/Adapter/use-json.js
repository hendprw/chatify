// File: lib/Adapter/use-json.js
// Module: Chatify Framework

const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

/**
 * Adapter Lokal (File System)
 * @param {String} sessionName 
 */
const useJson = async (sessionName) => {
    const { state, saveCreds } = await useMultiFileAuthState(sessionName);
    return {
        state,
        saveCreds
    };
};

module.exports = useJson;