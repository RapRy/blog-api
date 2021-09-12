const UserModel = require("../models/userModel.js");
const TopicModel = require("../models/topicModel.js");
const ReplyModel = require("../models/replyModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getParticipants = async (req, res) => {
  try {
    const { postId, creatorId } = req.query;
    const replies = await ReplyModel.aggregate([
      { $match: { "ref.topic": postId } },
      { $group: { _id: null, users: { $addToSet: "$ref.creator" } } },
      {
        $project: {
          _id: 0,
          creators: {
            $filter: {
              input: "$users",
              as: "user",
              cond: { $ne: ["$$user", creatorId] },
            },
          },
        },
      },
    ]);

    if (replies.length > 0) {
      const users = await UserModel.find({ _id: replies[0].creators });
      res.status(200).json({ users });
      return;
    }

    res.status(204).json({ users: [] });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User does not exists!" });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getTopicsByUser = async (req, res) => {
  try {
    const id = req.params.id;
    const topics = await TopicModel.find({ "ref.creator": id, active: 1 });

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getBlacklistedUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ active: 1, blacklisted: 1 }).sort({
      updatedAt: -1,
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getRegisteredUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      $or: [{ active: 0, blacklisted: 0, accountType: 0 }, { active: 1 }],
    }).sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getNewUsers = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit);
    const users = await UserModel.find({ active: 1, accountType: 0 })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit);
    const users = await UserModel.find({
      active: 1,
      blacklisted: 0,
      accountType: 0,
    }).limit(limit);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getActiveUsersCount = async (req, res) => {
  try {
    const activeUsersCount = await UserModel.countDocuments({
      active: 1,
      blacklisted: 0,
      accountType: 0,
    });

    res.status(200).json({ count: activeUsersCount });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const getAllUsersCount = async (req, res) => {
  try {
    const registeredUsersCount = await UserModel.countDocuments({
      accountType: 0,
    });

    res.status(200).json({ count: registeredUsersCount });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existUser = await UserModel.findOne({ email });

    if (!existUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existUser.password
    );

    if (
      !isPasswordCorrect ||
      existUser.active === 0 ||
      existUser.blacklisted === 1
    )
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        email: existUser.email,
        username: existUser.username,
        id: existUser._id,
      },
      process.env.SECRET
    );

    res.status(200).json({ result: existUser, token });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const signUpUser = async (req, res) => {
  const { username, email, password, schoolId } = req.body;

  try {
    const existUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const date = new Date();

    const result = await UserModel.create({
      name: {
        firstName: "",
        lastName: "",
      },
      username,
      email,
      password: hashedPassword,
      avatar: "",
      accountType: 0,
      active: 0,
      blacklisted: 0,
      date: {
        registered: date,
        activity: [],
      },
      schoolId,
      post: {
        topics: [],
        replies: [],
      },
    });

    const token = jwt.sign(
      { email: result.email, username: result.username, id: result._id },
      process.env.SECRET
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { email, firstName, lastName, username, schoolId, id } = req.body;

    // const existUsername = await UserModel.findOne({ username })

    // if(existUsername) return res.status(200).json({ message: 'username already in use', status: 0 })

    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        email,
        "name.firstName": firstName,
        "name.lastName": lastName,
        username,
        schoolId,
      },
      { useFindAndModify: false, new: true }
    );

    const token = jwt.sign(
      { email: user.email, username: user.username, id: user._id },
      process.env.SECRET
    );

    res.status(200).json({ result: user, token });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const id = req.params.id;

    await UserModel.findByIdAndUpdate(
      id,
      { blacklisted: 1 },
      { useFindAndModify: false }
    );

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const unblockUser = async (req, res) => {
  try {
    const id = req.params.id;

    await UserModel.findByIdAndUpdate(
      id,
      { blacklisted: 0 },
      { useFindAndModify: false }
    );

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const activateUser = async (req, res) => {
  try {
    const id = req.params.id;

    await UserModel.findByIdAndUpdate(
      id,
      { active: 1 },
      { useFindAndModify: false }
    );

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const id = req.params.id;

    await UserModel.findByIdAndUpdate(
      id,
      { active: 0 },
      { useFindAndModify: false }
    );

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({
      message:
        "Application rejected: Something went wrong, try sending form again",
    });
  }
};

module.exports = {
  getUser,
  getActiveUsersCount,
  getAllUsersCount,
  signUpUser,
  signInUser,
  getNewUsers,
  getActiveUsers,
  getRegisteredUsers,
  blockUser,
  getBlacklistedUsers,
  activateUser,
  unblockUser,
  deactivateUser,
  getTopicsByUser,
  updateUserDetails,
  getParticipants,
};
