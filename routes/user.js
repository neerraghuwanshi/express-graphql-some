const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');

const router = express.Router();

router.post(
    '/signup',
    [
        body('email')
        .isEmail()
        .withMessage('Invalid E-mail')
        .custom(value => !/\s/.test(value))
        .withMessage('Cannot include a White Space')
        .normalizeEmail(),

        body('firstName')
        .isString()
        .withMessage('Must be a string')
        .isLength({ min: 2 })
        .withMessage('Cannot be Less than 2 Characters')
        .isLength({ max: 20 })
        .withMessage('Cannot be Greater than 20 Characters')
        .custom(value => !/\s/.test(value))
        .withMessage('Cannot include a White Space')
        .custom(value => !/[^\x20-\x7F]/.test(value))
        .withMessage('ASCII Characters other than HEX(20-7F) are not allowed'),

        body('lastName')
        .isString()
        .withMessage('Must be a string')
        .isLength({ min: 2 })
        .withMessage('Cannot be Less than 2 Characters')
        .isLength({ max: 20 })
        .withMessage('Cannot be Greater than 20 Characters')
        .custom(value => !/\s/.test(value))
        .withMessage('Cannot include a White Space')
        .custom(value => !/[^\x20-\x7F]/.test(value))
        .withMessage('ASCII Characters other than HEX(20-7F) are not allowed'),

        body('password')
        .isString()
        .withMessage('Must be a string')
        .isLength({ min: 8 })
        .withMessage('Cannot be Less than 8 Characters')
        .isLength({ max: 20 })
        .withMessage('Cannot be Greater than 20 Characters')
        .custom(value => !/\s/.test(value))
        .withMessage('Cannot include a White Space')
        .custom(value => /[a-z]/.test(value))
        .withMessage('Needs a Lower Case Letter')
        .custom(value => /[A-Z]/.test(value))
        .withMessage('Needs an Upper Case Letter')
        .custom(value => /\d/.test(value))
        .withMessage('Needs a Number')
        .custom(value => /\W/.test(value))
        .withMessage('Needs a Special Character')
        .custom(value => !/[^\x20-\x7F]/.test(value))
        .withMessage('ASCII Characters other than HEX(20-7F) are not allowed'),
    ],
    userController.signup
);

router.post(
    '/login',
    [
        body('email')
        .isEmail()
        .withMessage('Invalid E-mail')
        .custom(value => !/\s/.test(value))
        .withMessage('Cannot include a White Space')
        .normalizeEmail(),

        body('password')
        .isString()
        .withMessage('Must be a string')
        .isLength({ min: 8 })
        .withMessage('Cannot be Less than 8 Characters')
        .isLength({ max: 20 })
        .withMessage('Cannot be Greater than 20 Characters')
        .custom(value => !/\s/.test(value))
        .withMessage('Cannot include a White Space')
        .custom(value => /[a-z]/.test(value))
        .withMessage('Needs a Lower Case Letter')
        .custom(value => /[A-Z]/.test(value))
        .withMessage('Needs an Upper Case Letter')
        .custom(value => /\d/.test(value))
        .withMessage('Needs a Number')
        .custom(value => /\W/.test(value))
        .withMessage('Needs a Special Character')
        .custom(value => !/[^\x20-\x7F]/.test(value))
        .withMessage('ASCII Characters other than HEX(20-7F) are not allowed'),
    ],
    userController.login
);

router.post('/initials', userController.getInitials);

module.exports = router;