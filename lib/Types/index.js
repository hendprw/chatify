// File: lib/Types/index.js
// Module: Chatify Framework

/**
 * @typedef {Object} ChatifyOptions
 * @property {string} [session] - Nama folder atau ID sesi database.
 * @property {boolean} [online] - Apakah bot harus terlihat online terus menerus.
 * @property {string[]} [browser] - Identitas browser [Nama, OS, Versi].
 * @property {'json'|'mongo'|'redis'|'sqlite'|'mysql'|'pg'} [type] - Jenis database.
 * @property {string} [url] - URL koneksi untuk database (kecuali JSON/SQLite).
 */

/**
 * @typedef {Object} MessageObject
 * @property {string} id - ID unik pesan.
 * @property {string} from - JID pengirim/grup.
 * @property {string} sender - JID pengirim asli (individu).
 * @property {boolean} isGroup - Apakah berasal dari grup.
 * @property {boolean} isSelf - Apakah dikirim oleh bot sendiri.
 * @property {string} pushName - Nama pengguna pengirim.
 * @property {string} body - Isi teks pesan.
 * @property {string} type - Tipe pesan (imageMessage, dll).
 * @property {Function} reply - Fungsi untuk membalas pesan.
 * @property {Function} react - Fungsi untuk memberi reaksi emoji.
 * @property {Function} download - Fungsi untuk mengunduh media.
 * @property {Function} delete - Fungsi untuk menghapus pesan.
 */

module.exports = {};