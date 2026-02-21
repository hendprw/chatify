// File: lib/Adapter/index.js
// Module: Chatify Framework

const useJson = require('./use-json');
const useMongo = require('./use-mongo');
const useRedis = require('./use-redis');
const useSQLite = require('./use-sqlite');
const usePostgreSQL = require('./use-postgresql');
const useMySQL = require('./use-mysql');

/**
 * Factory untuk memilih Auth Adapter
 */
const AuthAdapter = async (type = 'json', sessionName, url = '') => {
    switch (type) {
        case 'mongo':
            return await useMongo(sessionName, url);
        case 'redis':
            return await useRedis(sessionName, url);
        case 'sqlite':
            return await useSQLite(sessionName);
        case 'pg':
        case 'postgres':
            return await usePostgreSQL(sessionName, url);
        case 'mysql':
            return await useMySQL(sessionName, url);
        case 'json':
        default:
            return await useJson(sessionName);
    }
};

module.exports = { AuthAdapter };