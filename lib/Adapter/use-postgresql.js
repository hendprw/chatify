// File: lib/Adapter/use-postgresql.js
// Module: Chatify Framework

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { BufferJSON } = require('@whiskeysockets/baileys');
const makeAuthFactory = require('./AuthFactory');

const useSQLite = async (sessionName) => {
    const dbPath = path.join(__dirname, `../../session/${sessionName}.db`);
    
    // Buka/Buat Database
    const db = new sqlite3.Database(dbPath);

    // Inisialisasi Table
    await new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS sessions (
            key TEXT PRIMARY KEY,
            value TEXT
        )`, (err) => err ? reject(err) : resolve());
    });

    // Wrapper Read
    const readData = async (key) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT value FROM sessions WHERE key = ?", [key], (err, row) => {
                if (err) return reject(err);
                if (row) {
                    try {
                        return resolve(JSON.parse(row.value, BufferJSON.reviver));
                    } catch {
                        return resolve(null);
                    }
                }
                resolve(null);
            });
        });
    };

    // Wrapper Write
    const writeData = async (key, value) => {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(value, BufferJSON.replacer);
            db.run("INSERT OR REPLACE INTO sessions (key, value) VALUES (?, ?)", [key, data], (err) => {
                err ? reject(err) : resolve();
            });
        });
    };

    // Wrapper Remove
    const removeData = async (key) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM sessions WHERE key = ?", [key], (err) => {
                err ? reject(err) : resolve();
            });
        });
    };

    // Gunakan AuthFactory
    return await makeAuthFactory(readData, writeData, removeData);
};

module.exports = useSQLite;