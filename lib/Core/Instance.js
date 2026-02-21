// File: lib/Core/Instance.js
// Module: Chatify Framework

const EventEmitter = require('events');
const Connection = require('./Connection');
const Node = require('./Node');
const Listener = require('../Listener');

class Chatify extends EventEmitter {
    constructor(options = {}) {
        super();
        this.connection = new Connection(options);
        this.sock = null;
        this.node = null;
    }

    async start() {
        this.sock = await this.connection.connect();
        this.node = new Node(this.sock);

        Listener(this.sock, (event, data, sock) => {
            this.emit(event, data, sock);
        });

        return this.sock;
    }
}

module.exports = Chatify;