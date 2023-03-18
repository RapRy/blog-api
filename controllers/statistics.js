const CategoryModel = require("../models/categoryModel.js");
const ReplyModel = require("../models/replyModel.js");
const TopicModel = require("../models/topicModel.js");
const UserModel = require("../models/userModel.js");

const getAllStats = async (req, res) => {
  try {
    const categoriesCount = await CategoryModel.countDocuments({ active: 1 });
    const repliesCount = await ReplyModel.countDocuments({ active: 1 });
    const topics = await TopicModel.find();
    const topicsCount = await TopicModel.countDocuments({ active: 1 });
    const activeUsersCount = await UserModel.countDocuments({
      active: 1,
      blacklisted: 0,
      accountType: 0,
    });
    const registeredUsersCount = await UserModel.countDocuments({
      accountType: 0,
    });

    let upVotes = [];
    let downVotes = [];

    topics.forEach((topics) => {
      if (topics.meta.upvotes.length > 0) {
        topics.meta.upvotes.forEach((vote) => upVotes.push(vote));
        topics.meta.downvotes.forEach((vote) => downVotes.push(vote));
      }
    });

    res.status(200).json({
      activeCategories: categoriesCount,
      replies: repliesCount,
      upvotes: upVotes.length,
      downvotes: downVotes.length,
      topics: topicsCount,
      activeUsers: activeUsersCount,
      registeredUsers: registeredUsersCount,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

module.exports = {
  getAllStats,
};
