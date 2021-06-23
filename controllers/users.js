const UserModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = 'test';

const signInUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await UserModel.findOne({ email });

        if(!existUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ result: existUser });
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
            date: {
                registered: date
            },
            schoolId,
            post: {
                topics: [],
                replies: []
            }
        })

        const token = jwt.sign({ email: result.email, username: result.username, id: result._id }, secret);

        res.status(201).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error); 
    }
}

module.exports = {
    signUpUser,
    signInUser
}