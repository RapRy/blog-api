const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const replySchema = new Schema({
    reply: String,
    active: Number,
    ref: {
        category: String,
        topic: String,
        creator: String
    }
}, { timestamps: true })

const Reply = model('reply', replySchema);

module.exports = Reply