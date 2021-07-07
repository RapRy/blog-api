const UserModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await UserModel.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getRegisteredUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ active: 0 }).sort({ createdAt: -1 })

        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getNewUsers = async (req, res) => {
    try {
        const limit = parseInt(req.params.limit)
        const users = await UserModel.find({ active: 1, accountType: 0 }).sort({ createdAt: -1 }).limit(limit)
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getActiveUsers = async (req, res) => {
    try {
        const limit = parseInt(req.params.limit)
        const users = await UserModel.find({ active: 1 }).limit(limit)
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getActiveUsersCount = async (req, res) => {
    try {
        const activeUsersCount = await UserModel.countDocuments({ active: 1, accountType: 0 })

        res.status(200).json({ activeUsersCount });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const getAllUsersCount = async (req, res) => {
    try {
        const registeredUsersCount = await UserModel.countDocuments({ accountType: 0 })

        res.status(200).json({ registeredUsersCount });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const signInUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await UserModel.findOne({ email });

        if(!existUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: existUser.email, username: existUser.username, id: existUser._id }, process.env.SECRET);

        res.status(200).json({ result: existUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error); 
    }
}

const signUpUser = async (req, res) => {
    const { username, email, password, schoolId } = req.body;

    try {
        const existUser = await UserModel.findOne({ $or: [{ email }, { username }] });

        if(existUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const date = new Date();

        const result = await UserModel.create({
            name: {
                firstName: "",
                lastName: ""
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
                activity: []
            },
            schoolId,
            post: {
                topics: [],
                replies: []
            }
        })

        const token = jwt.sign({ email: result.email, username: result.username, id: result._id }, process.env.SECRET);

        res.status(200).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error); 
    }
}

module.exports = {
    getUser,
    getActiveUsersCount,
    getAllUsersCount,
    signUpUser,
    signInUser,
    getNewUsers,
    getActiveUsers,
    getRegisteredUsers
}