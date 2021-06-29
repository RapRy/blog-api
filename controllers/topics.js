const TopicModel = require('../models/topicModel.js');
const CategoryModel = require('../models/categoryModel');

const publishTopic = async (req, res) => {
    const { title, ref, description } = req.body;
    const { category, creator } = ref;

    try {
        const topicExist = await TopicModel.findOne({ title, 'ref.category': category }, { ref: category });
        const categoryValues = await CategoryModel.findById(category);

        if(topicExist) return res.status(200).json({ message: `${title} already exist!`, status: 0 });

        const topicResult = await TopicModel.create({
            title,
            description,
            active: 1,
            ref,
            meta: {
                replies: [],
                views: []
            }
        })

        const categoryUpdateResult = await CategoryModel.findByIdAndUpdate(category, { 
            meta: { ...categoryValues.meta, ['topics']: [ ...categoryValues.meta.topics, topicResult._id ] } 
        }, { useFindAndModify: false })

        res.status(200).json({ result: topicResult, status: 1 })
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
    publishTopic
}