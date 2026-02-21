// File: lib/Adapter/use-mysql.js
// Module: Chatify Framework

const mysql = require('mysql2/promise');
const { BufferJSON } = require('@whiskeysockets/baileys');
const makeAuthFactory = require('./AuthFactory');

const useMySQL = async (sessionName, dbUrl) => {
    // dbUrl format: mysql://user:pass@host:port/dbname
    const connection = await mysql.createConnection(dbUrl);
    const tableName = `session_${sessionName}`;

    await connection.execute(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            \`key\` VARCHAR(255) PRIMARY KEY,
            \`value\` LONGTEXT
        ) ENGINE=InnoDB;
    `);

    const readData = async (key) => {
        const [rows] = await connection.execute(`SELECT value FROM ${tableName} WHERE \`key\` = ?`, [key]);
        if (rows.length > 0) {
            return JSON.parse(rows[0].value, BufferJSON.reviver);
        }
        return null;
    };

    const writeData = async (key, value) => {
        const data = JSON.stringify(value, BufferJSON.replacer);
        await connection.execute(`
            INSERT INTO ${tableName} (\`key\`, \`value\`) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)
        `, [key, data]);
    };

    const removeData = async (key) => {
        await connection.execute(`DELETE FROM ${tableName} WHERE \`key\` = ?`, [key]);
    };

    return await makeAuthFactory(readData, writeData, removeData);
};

module.exports = useMySQL;