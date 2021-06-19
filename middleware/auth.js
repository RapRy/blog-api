const jwt = require('jsonwebtoken');

const secret = 'test';

const auth = async (req, res, next) => {
    try {
        console.log('yes')
    } catch (error) {
        console.log(error)
    }
}