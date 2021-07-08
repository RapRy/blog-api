const ReplyModel = require('../models/replyModel.js');
const TopicModel = require('../models/topicModel.js');
const CategoryModel = require('../models/categoryModel.js');
const UserModel = require('../models/userModel.js');

const addReply = async (req, res) => {

    try {
        const { reply, ref } = req.body
        const { creator, topic } = ref

        const date = new Date()

        const Reply = await ReplyModel.create({
            reply,
            active: 1,
            ref,
        })

        const topicValues = await TopicModel.findById(topic)
        const userValues = await UserModel.findById(creator)
        const activity =  { id: Reply._id, date }



        await TopicModel.findByIdAndUpdate(topic, {
            meta: {
                ...topicValues.meta,
                ['replies']: [ ...topicValues.meta.replies, Reply._id ]
            }
        }, { useFindAndModify: false })

        await UserModel.findByIdAndUpdate(creator, {
            post: {
                ...userValues.post,
                ['replies']: [ ...userValues.post.replies, Reply._id ],
            },
            'date.activity': [ 
                ...userValues.date.activity, 
                activity
            ]
        }, { useFindAndModify: false })

        res.status(200).json(Reply)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const repliesCount = async (req, res) => {
    try {
        const repliesCount = await ReplyModel.countDocuments({ active: 1 })
        res.status(200).json({ repliesCount });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getReplies = async (req, res) => {
    try {
        const id = req.params.id
        const replies = await ReplyModel.find({ 'ref.topic': id, active: 1 })

        res.status(200).json(replies)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

module.exports = {
    addReply,
    repliesCount,
    getReplies
}