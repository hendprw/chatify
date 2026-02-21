// File: lib/Core/Node.js
// Module: Chatify Framework

class Node {
    constructor(sock) {
        this.sock = sock;
    }

    async query(stack) {
        return await this.sock.query(stack);
    }

    async fetchBlocklist() {
        try {
            return await this.sock.fetchBlocklist();
        } catch {
            return [];
        }
    }

    async updateBlockStatus(jid, action) {
        try {
            await this.sock.updateBlockStatus(jid, action);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = Node;