// File: lib/Adapter/use-mongo.js
// Module: Chatify Framework

const mongoose = require('mongoose');
const { BufferJSON } = require('@whiskeysockets/baileys');
const makeAuthFactory = require('./AuthFactory');

const sessionSchema = new mongoose.Schema({
    _id: String,
    data: Object
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

const useMongo = async (sessionName, mongoUrl) => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(mongoUrl);
    }

    const readData = async (key) => {
        const doc = await Session.findOne({ _id: `${sessionName}-${key}` });
        return doc ? JSON.parse(JSON.stringify(doc.data), BufferJSON.reviver) : null;
    };

    const writeData = async (key, value) => {
        await Session.findOneAndUpdate(
            { _id: `${sessionName}-${key}` },
            { data: JSON.parse(JSON.stringify(value, BufferJSON.replacer)) },
            { upsert: true, new: true }
        );
    };

    const removeData = async (key) => {
        await Session.deleteOne({ _id: `${sessionName}-${key}` });
    };

    return await makeAuthFactory(readData, writeData, removeData);
};

module.exports = useMongo;