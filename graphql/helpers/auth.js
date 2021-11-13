import { AuthenticationError } from 'apollo-server-express'

import User from '../../models/user'


export const isAuthenticated = (req) => {
    if (!req.user) {
        throw new AuthenticationError('Not authenticated')
    }
}

export const authenticate = async (req) => {
    const authHeader = req.get('Authorization')
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        const user = await User.findOne({ token })
        if (user) {
            req.user = user
        }
    }
}