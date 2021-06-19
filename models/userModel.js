const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        firstName: String,
        lastName: String
    },
    username: String,
    email: String,
    password: String,
    avatar: String,
    accountType: Number,
    date: {
        registered: Date,
        updated: Date,
        activity: Date
    },
    schoolId: Number,
    post: {
        topics: [String],
        replies: [String]
    }
});

const Users = model('user', userSchema);

module.exports = Users;