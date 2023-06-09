const TopicModel = require("../models/topicModel.js");
const CategoryModel = require("../models/categoryModel");
const UserModel = require("../models/userModel.js");
const ReplyModel = require("../models/replyModel.js");

const getUpVotesCount = async (req, res) => {
  try {
    // const count = await TopicModel.aggregate([
    //   {
    //     $group: {
    //       id: "$_id",
    //       upVotes: {
    //         $push: { item: "$meta.upvotes" },
    //       },
    //     },
    //   },
    // ]);

    const topics = await TopicModel.find();

    let upVotes = [];

    topics.forEach((topics) => {
      if (topics.meta.upvotes.length > 0) {
        topics.meta.upvotes.forEach((vote) => upVotes.push(vote));
      }
    });

    res.status(200).json({ count: upVotes.length });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getDownVotesCount = async (req, res) => {
  try {
    // const count = await TopicModel.aggregate([
    //   {
    //     $group: {
    //       id: "$_id",
    //       upVotes: {
    //         $push: { item: "$meta.upvotes" },
    //       },
    //     },
    //   },
    // ]);

    const topics = await TopicModel.find();

    let downVotes = [];

    topics.forEach((topics) => {
      if (topics.meta.downvotes.length > 0) {
        topics.meta.downvotes.forEach((vote) => downVotes.push(vote));
      }
    });

    res.status(200).json({ count: downVotes.length });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getTopicCounts = async (req, res) => {
  try {
    const topicsCount = await TopicModel.countDocuments({ active: 1 });
    res.status(200).json({ count: topicsCount });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getTopic = async (req, res) => {
  const id = req.params.id;

  try {
    const topic = await TopicModel.findById(id);

    const creator = await UserModel.findById(topic.ref.creator);

    const category = await CategoryModel.findById(topic.ref.category);

    const replies = await ReplyModel.find({ "ref.topic": id, active: 1 }).sort({
      createdAt: -1,
    });

    res.status(200).json({ topic, creator, category, replies });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getLatestTopics = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit);

    const topics = await TopicModel.find({ active: 1 })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getLatestTopicsByCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const topics = await TopicModel.find({ active: 1, "ref.category": id })
      .sort({ createdAt: -1 })
      .limit(5);

    // const category = await CategoryModel.findOne({ active: 1, _id: id });

    res.status(200).json({ topics });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getHotTopics = async (req, res) => {
  try {
    // const topics = await TopicModel.find({ active: 1, 'meta.replies': { $gt: { $size: 2 } } }).limit(6)
    const limit = parseInt(req.params.limit);
    const topics = await TopicModel.find({ active: 1 }).limit(limit);

    const maxReplies = 2;

    const hotTopics = [];

    topics.forEach((top, i) => {
      if (i === 6 && limit !== 0) return;
      if (top.meta.replies.length >= maxReplies) hotTopics.push(top);
    });

    res.status(200).json(hotTopics);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getHotTopicsByCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const topics = await TopicModel.find({ active: 1, "ref.category": id });

    const hotTopics = [];

    topics.forEach((top, i) => {
      if (i === 6) return;
      if (top.meta.replies.length >= 2) hotTopics.push(top);
    });

    // const category = await CategoryModel.findOne({ active: 1, _id: id });

    res.status(200).json({ topics: hotTopics });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getRelatedTopics = async (req, res) => {
  try {
    const id = req.params.id;

    const currentTopic = await TopicModel.findById(id);

    const topics = await TopicModel.find({
      "ref.category": currentTopic.ref.category,
      _id: { $nin: [id] },
    }).limit(8);

    const filtered = topics.filter((top) => top._id !== currentTopic._id);

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getTopics = async (req, res) => {
  const id = req.params.id;

  if (id === "topics") {
    try {
      const topics = await TopicModel.find({ active: 1 });

      res.status(200).json(topics);
    } catch (error) {
      res.status(500).json({
        message:
          "Application rejected: Something went wrong, try sending form again",
      });
    }
  } else {
    try {
      const topics = await TopicModel.find({ "ref.category": id, active: 1 });

      res.status(200).json(topics);
    } catch (error) {
      res.status(500).json({
        message:
          "Application rejected: Something went wrong, try sending form again",
      });
    }
  }
};

const getTopicsWithLimit = async (req, res) => {
  const limit = parseInt(req.params.limit);

  try {
    const topics = await TopicModel.find({ active: 1 })
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json(topics);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const publishTopic = async (req, res) => {
  const { title, ref, description } = req.body;
  const { category, creator } = ref;

  try {
    const topicExist = await TopicModel.findOne(
      { title, "ref.category": category },
      { ref: category }
    );
    const categoryValues = await CategoryModel.findById(category);

    if (topicExist)
      return res
        .status(200)
        .json({ message: `${title} already exist!`, status: 0 });

    const topicResult = await TopicModel.create({
      title,
      description,
      active: 1,
      ref,
      meta: {
        replies: [],
        views: [],
      },
    });

    const creatorValues = await UserModel.findById(creator);

    await CategoryModel.findByIdAndUpdate(
      category,
      {
        meta: {
          ...categoryValues.meta,
          ["topics"]: [...categoryValues.meta.topics, topicResult._id],
        },
      },
      { useFindAndModify: false }
    );

    await UserModel.findByIdAndUpdate(
      creator,
      {
        post: {
          ...creatorValues.post,
          ["topics"]: [...creatorValues.post.topics, topicResult._id],
        },
      },
      { useFindAndModify: false }
    );

    res.status(200).json({ result: topicResult, status: 1 });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const addTopicViews = async (req, res) => {
  try {
    const { topicId, viewer } = req.body;

    const topic = await TopicModel.findById(topicId);

    await TopicModel.findByIdAndUpdate(
      topicId,
      {
        "meta.views": [...topic.meta.views, viewer],
      },
      { useFindAndModify: false }
    );

    res.status(200);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const updateTopic = async (req, res) => {
  try {
    const { title, ref, description, topicId } = req.body;
    const { category, creator } = ref;

    const topicExist = await TopicModel.findOne({
      title,
      "ref.category": category,
    });
    const oldTopic = await TopicModel.findById(topicId);

    if (topicExist && oldTopic.ref.category !== category) {
      const cat = await CategoryModel.findById(category);
      return res
        .status(200)
        .json({ message: `${title} already exists in ${cat.name}`, status: 0 });
    }

    const previousTopic = await TopicModel.findById(topicId);

    const updatedTopic = await TopicModel.findByIdAndUpdate(
      topicId,
      {
        title,
        description,
        ref,
      },
      { useFindAndModify: false, new: true }
    );

    if (previousTopic.ref.category !== updatedTopic.ref.category) {
      const cat = await CategoryModel.findById(previousTopic.ref.category);

      const filteredCatMeta = cat.meta.topics.filter((id) => id !== topicId);

      await CategoryModel.findByIdAndUpdate(
        previousTopic.ref.category,
        {
          "meta.topics": filteredCatMeta,
        },
        { useFindAndModify: false }
      );

      const newCat = await CategoryModel.findById(updatedTopic.ref.category);

      await CategoryModel.findByIdAndUpdate(
        updatedTopic.ref.category,
        {
          "meta.topics": [...newCat.meta.topics, topicId],
        },
        { useFindAndModify: false }
      );
    }

    res.status(200).json({ result: updatedTopic, status: 1 });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const updateActiveStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const topic = await TopicModel.findByIdAndUpdate(
      id,
      { active: 0 },
      {
        useFindAndModify: false,
        new: true,
      }
    );

    if (topic) {
      await ReplyModel.updateMany({ "ref.topic": topic._id }, { active: 0 });

      res.status(200).json({ message: "success" });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const searchTopics = async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const topics = await TopicModel.find({
      title: { $regex: `.*${keyword}*.` },
    });

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const voteTopic = async (req, res) => {
  try {
    const { topicId, userId, type } = req.body;

    const topicExist = await TopicModel.findById(topicId);
    const userExist = await UserModel.findById(userId);

    if (type === "upvote") {
      await TopicModel.findByIdAndUpdate(
        topicExist._id,
        {
          "meta.upvotes": [...topicExist.meta.upvotes, userId],
          "meta.donwvotes": topicExist.meta.downvotes.filter(
            (id) => id !== userId
          ),
        },
        { useFindAndModify: false }
      );

      await UserModel.findByIdAndUpdate(
        userExist._id,
        {
          "post.upvotes": [...userExist.post.upvotes, topicId],
          "post.downvotes": userExist.post.downvotes.filter(
            (id) => id !== topicId
          ),
        },
        { useFindAndModify: false }
      );
    } else if (type === "downvote") {
      await TopicModel.findByIdAndUpdate(
        topicExist._id,
        {
          "meta.downvotes": [...topicExist.meta.downvotes, userId],
          "meta.upvotes": topicExist.meta.upvotes.filter((id) => id !== userId),
        },
        { useFindAndModify: false }
      );

      await UserModel.findByIdAndUpdate(
        userExist._id,
        {
          "post.downvotes": [...userExist.post.downvotes, topicId],
          "post.upvotes": userExist.post.upvotes.filter((id) => id !== topicId),
        },
        { useFindAndModify: false }
      );
    }

    res
      .status(200)
      .json({ message: type === "upvote" ? "up voted" : "down voted" });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

module.exports = {
  getTopics,
  getTopic,
  publishTopic,
  addTopicViews,
  getTopicCounts,
  getLatestTopics,
  getHotTopics,
  getRelatedTopics,
  updateTopic,
  getLatestTopicsByCategory,
  getHotTopicsByCategory,
  updateActiveStatus,
  searchTopics,
  getTopicsWithLimit,
  voteTopic,
  getUpVotesCount,
  getDownVotesCount,
};
