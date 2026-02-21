// File: lib/Adapter/use-redis.js
// Module: Chatify Framework

const { createClient } = require('redis');
const { BufferJSON } = require('@whiskeysockets/baileys');
const makeAuthFactory = require('./AuthFactory');

const useRedis = async (sessionName, redisUrl) => {
    const client = createClient({ url: redisUrl });
    await client.connect();

    const dbKey = (key) => `${sessionName}:${key}`;

    const readData = async (key) => {
        const data = await client.get(dbKey(key));
        return data ? JSON.parse(data, BufferJSON.reviver) : null;
    };

    const writeData = async (key, value) => {
        await client.set(dbKey(key), JSON.stringify(value, BufferJSON.replacer));
    };

    const removeData = async (key) => {
        await client.del(dbKey(key));
    };

    return await makeAuthFactory(readData, writeData, removeData);
};

module.exports = useRedis;