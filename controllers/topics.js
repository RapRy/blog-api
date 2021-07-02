const TopicModel = require('../models/topicModel.js');
const CategoryModel = require('../models/categoryModel');
const UserModel = require('../models/userModel.js')
const ReplyModel = require('../models/replyModel.js')

const getTopicCounts = async (req, res) => {
    try {
        const topicsCount = await TopicModel.countDocuments({ active: 1 })
        res.status(200).json({ topicsCount });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getTopic = async (req, res) => {
    const id = req.params.id

    try {
        const topic = await TopicModel.findById(id)

        const creator = await UserModel.findById(topic.ref.creator)

        const category = await CategoryModel.findById(topic.ref.category)

        const replies = await ReplyModel.find({ 'ref.topic': id })

        res.status(200).json({ topic, creator, category, replies })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getLatestTopics = async (req, res) => {
    try {
        const topics = await TopicModel.find({ active: 1 }).sort({ createdAt: -1 }).limit(6)

        res.status(200).json(topics)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getHotTopics = async (req, res) => {
    try {
        const topics = await TopicModel.find({ active: 1 }).sort({ 'meta.replies': -1 }).limit(6)

        res.status(200).json(topics)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getRelatedTopics = async (req, res) => {
    try {
        const id = req.params.id

        const currentTopic = await TopicModel.findById(id)

        const topics = await TopicModel.find({ 'ref.category': currentTopic.ref.category, _id: { $nin: [id] } })

        const filtered = topics.filter(top => top._id !== currentTopic._id)

        res.status(200).json(filtered)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

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

        const creatorValues = await UserModel.findById(creator)


        await CategoryModel.findByIdAndUpdate(category, { 
            meta: { ...categoryValues.meta, ['topics']: [ ...categoryValues.meta.topics, topicResult._id ] } 
        }, { useFindAndModify: false })

        await UserModel.findByIdAndUpdate(creator, {
            post: {
                ...creatorValues.post,
                ['topics']: [ ...creatorValues.post.topics, topicResult._id ]
            } 
        }, { useFindAndModify: false })

        res.status(200).json({ result: topicResult, status: 1 })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const addTopicViews = async (req, res) => {
    try {
        const { topicId, viewer } = req.body

        const topic = await TopicModel.findById(topicId)

        await TopicModel.findByIdAndUpdate(topicId, {
            'meta.views': [ ...topic.meta.views, viewer ]
        }, { useFindAndModify: false })

        res.status(200)

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
    getTopics,
    getTopic,
    publishTopic,
    addTopicViews,
    getTopicCounts,
    getLatestTopics,
    getHotTopics,
    getRelatedTopics
}