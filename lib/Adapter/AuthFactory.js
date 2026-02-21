// File: lib/Adapter/AuthFactory.js
// Module: Chatify Framework

const { proto, initAuthCreds, BufferJSON } = require('@whiskeysockets/baileys');

/**
 * Membuat State Auth Baileys dari fungsi database generic
 * @param {Function} readData - Fungsi (key) => Promise<Object|null>
 * @param {Function} writeData - Fungsi (key, data) => Promise<void>
 * @param {Function} removeData - Fungsi (key) => Promise<void>
 */
const makeAuthFactory = async (readData, writeData, removeData) => {
    // 1. Load Creds (Identitas Utama)
    const creds = await readData('creds') || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                // Logic mengambil key (Pre-Key, Session Key, dll)
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            value = proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                // Logic menyimpan key
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            tasks.push(value ? writeData(key, value) : removeData(key));
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: () => writeData('creds', creds)
    };
};

module.exports = makeAuthFactory;