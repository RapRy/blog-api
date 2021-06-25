const CategoryModel = require('../models/categoryModel.js');

const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find({ active: 1 }).sort({ name: 1 })

        res.status(200).json({ categories })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getCategoriesCount = async (req, res) => {
    try {
        const categoriesCount = await CategoryModel.countDocuments({ active: 1 })

        res.status(200).json({ categoriesCount });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const addCategory = async (req, res) => {
    const { name } = req.body

    try {
        const catExist = await CategoryModel.findOne({ name })

        if(catExist) return res.status(200).json({ message: `${name} already exist!`, status: 0 });

        const result = await CategoryModel.create({ 
            name, 
            active: 1, 
            meta: { 
                topics: 0,
                replies: 0
            } 
        })

        res.status(200).json({ result, status: 1 });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
    getCategories,
    getCategoriesCount,
    addCategory
}