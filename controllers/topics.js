const TopicModel = require('../models/topicModel.js');
const CategoryModel = require('../models/categoryModel');

const getTopics = async (req, res) => {
    const id = req.params.id

    if(id === "topics"){
        try {
            const topics = await TopicModel.find({ active: 1 })

            res.status(200).json(topics)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }else{
        
        try {
            const topics = await TopicModel.find({ 'ref.category': id, active: 1 })
    
            res.status(200).json(topics)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

}

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
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
    getTopics,
    publishTopic
}