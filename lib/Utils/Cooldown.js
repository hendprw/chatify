// File: lib/Utils/Cooldown.js
// Module: Chatify Framework

/**
 * Map untuk menyimpan state cooldown
 * Format: Map<userId, timestamp>
 */
const cooldowns = new Map();

/**
 * Cek apakah user sedang dalam masa cooldown
 * @param {String} userId - ID Pengguna (nomor WA)
 * @param {Number} timeout - Durasi cooldown dalam milidetik (default: 5000ms)
 * @returns {Object} { isCooldown: boolean, timeLeft: number (seconds) }
 */
const isCooldown = (userId, timeout = 5000) => {
    if (cooldowns.has(userId)) {
        const expirationTime = cooldowns.get(userId) + timeout;
        const now = Date.now();

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return {
                isCooldown: true,
                timeLeft: timeLeft.toFixed(1)
            };
        }
    }
    
    // Jika tidak cooldown atau sudah lewat, update timestamp baru
    cooldowns.set(userId, Date.now());
    
    // Auto clear memory setelah timeout lewat agar Map tidak penuh
    setTimeout(() => {
        cooldowns.delete(userId);
    }, timeout);

    return {
        isCooldown: false,
        timeLeft: 0
    };
};

/**
 * Reset cooldown user tertentu (misal untuk owner)
 */
const resetCooldown = (userId) => {
    cooldowns.delete(userId);
};

module.exports = { isCooldown, resetCooldown };