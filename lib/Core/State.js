// File: lib/Core/State.js
// Module: Chatify Framework

const { AuthAdapter } = require('../Adapter');

class State {
    constructor(sessionName, type = 'json', url = '') {
        this.sessionName = sessionName;
        this.type = type;
        this.url = url;
    }

    async get() {
        return await AuthAdapter(this.type, this.sessionName, this.url);
    }
}

module.exports = State;