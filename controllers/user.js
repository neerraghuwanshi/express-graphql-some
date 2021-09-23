const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if (user) {
            const error = new Error('E-mail is already registered');
            error.statusCode = 401;
            throw error;
        }
        return bcrypt.hash(password, 12)
    })
    .then(hashedPw => {
        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPw,
        });
        return user.save();
    })
    .then(() => {
        const token = jwt.sign(
            {
                email,
                firstName,
                lastName,
            }, 
            process.env.JWT_SECRET_KEY, 
            { 
                expiresIn: '1h',
            }
        );
        res.status(200).json({ 
            token: token,
            name: firstName + ' ' + lastName,
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
  
exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            const error = new Error('Found no user for this email');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if (!isEqual) {
            const error = new Error('Incorrect password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: email,
                firstName: loadedUser.firstName,
                lastName: loadedUser.lastName,
            }, 
            process.env.JWT_SECRET_KEY, 
            { 
                expiresIn: '1h',
            }
        );
        res.status(200).json({ 
            token: token,
            name: loadedUser.firstName + ' ' + loadedUser.lastName,
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.getInitials = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    res.status(200).json({
        email: decodedToken.email,
        name: decodedToken.firstName + ' ' + decodedToken.lastName,
    });
}