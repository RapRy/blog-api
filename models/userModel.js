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
    active: Number,
    blacklisted: Number,
    date: {
        registered: Date,
        activity: [{
            id: String,
            date: Date
        }]
    },
    schoolId: Number,
    post: {
        topics: [String],
        replies: [String]
    }
}, { timestamps: true });

const Users = model('user', userSchema);

module.exports = Users;