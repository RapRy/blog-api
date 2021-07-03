const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: String,
    active: Number,
    meta: {
        topics: [String]
    }   
}, { timestamps: true });

const Categories = model('category', categorySchema);

module.exports = Categories;