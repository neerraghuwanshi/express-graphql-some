import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {
    AuthenticationError,
    UserInputError
} from 'apollo-server-express'

import {
    loginValidator,
    signUpValidator,
    verifyEmailValidator,
    searchEmailsValidator,
} from '../validators/auth'
import User from '../../models/user'
import { sendEmail } from '../helpers/sendEmail'
import UnverifiedUser from '../../models/unverifiedUser'
import { isAuthenticated, authenticate } from '../helpers/auth'


const Resolvers = {
    Query: {
        login: async (parent, args) => {
            await loginValidator(args.loginInput)
            const { email, password } = args.loginInput

            const user = await User.findOne({ email })
            if (!user) {
                throw new UserInputError('Found no user for this email')
            }

            const correctPassword = await bcrypt.compare(
                password, 
                user.password
            )
            if (!correctPassword) {
                throw new AuthenticationError('Incorrect password')
            }

            const token = jwt.sign(
                {
                    email
                }, 
                process.env.JWT_SECRET_KEY, 
                { 
                    expiresIn: '1h',
                }
            )

            user.token = token
            await user.save()

            return {
                token,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        },

        logout: async (parent, args, context) => {
            const req = context.req
            await authenticate(req)
            isAuthenticated(req)
            await User.updateOne(
                { token: req.user.token }, 
                { token: null },
            )
        },

        searchEmails: async (parent, args, context) => {
            await searchEmailsValidator(args)
            const req = context.req
            await authenticate(req)
            isAuthenticated(req)
            const users = await User.find(
                {
                    _id: { $ne: req.user._id },
                    email: new RegExp(args.email, 'i'),
                },
                '_id email firstName lastName',
            )
            return users
        },
    },


    Mutation: {
        signUp: async (parent, args) => {
            await signUpValidator(args.signUpInput)
            const { email, password, firstName, lastName } = args.signUpInput

            const user = await User.findOne({ email })
            if (user) {
                throw new AuthenticationError('E-mail is already registered')
            }

            const otp = `${Math.floor(100000 + Math.random() * 900000)}`
            const hashedPassword = await bcrypt.hash(password, 12)
            const unverifiedUser = new UnverifiedUser({
                otp,
                email,
                firstName,
                lastName,
                password: hashedPassword,
            })
            await unverifiedUser.save()

            const subject = 'OTP for E-mail Validation'
            const bodyContent = `
                <p>
                    Welcome to ${process.env.EMAIL_SENDER_NAME}.
                </p>
                <p>
                    Verify your E-mail with this OTP - ${otp}.
                </p>
            `
            const name = `${firstName} ${lastName}`
            await sendEmail({ name, email, subject, bodyContent })

            return { 
                _id: unverifiedUser._id
            }
        },


        verifyEmail: async (parent, args) => {
            await verifyEmailValidator(args.verifyEmailInput)
            const { otp, _id } = args.verifyEmailInput

            const objectId = new mongoose.Types.ObjectId(_id)
            const unverifiedUser = await UnverifiedUser.findOne({
                _id: objectId,
            })
            if (!unverifiedUser) {
                throw new UserInputError('No user request for this id')
            }

            let currentTime = new Date().getTime()
            let objectCreationTime = objectId.getTimestamp().getTime()
            if (((currentTime - objectCreationTime) / 1000) > 300) {
                throw new AuthenticationError('OTP Expired')
            }
            if (`${otp}` !== unverifiedUser.otp) {
                throw new AuthenticationError('Wrong OTP')
            }

            const token = jwt.sign(
                {
                    email: unverifiedUser.email,
                }, 
                process.env.JWT_SECRET_KEY, 
                { 
                    expiresIn: '1h',
                }
            )

            const user = new User({
                token,
                email: unverifiedUser.email,
                firstName: unverifiedUser.firstName,
                lastName: unverifiedUser.lastName,
                password: unverifiedUser.password,
            })
            await user.save()
            await UnverifiedUser.deleteMany({ email: unverifiedUser.email })

            return { token }
        },
    },
}


export default Resolvers