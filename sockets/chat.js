import mongoose from 'mongoose'

import User from '../models/user'
import Chat from '../models/chat'
import { authenticate } from './helpers/auth'


export const chatFunctions = (socket, io) => {
    socket.on('fetchChats', async (data) => {
        const user = await authenticate(data)
        if (!user) {
            return
        }
        
        const chats = await Chat.find({
            participants: user._id,
            lastMessage: { $ne: null },
        })
        .populate('participants', '-_id email')
        .populate('lastMessage', '-_id message')
        .sort({ 'updatedAt': -1 })

        io.sockets.in(user._id.toString()).emit('chats', chats)
    })

    socket.on('addChat', async (data) => {
        const user = await authenticate(data)
        if (!user || user._id.toString() === data.participant) {
            return
        }
        
        const user2Id = mongoose.Types.ObjectId(data.participant)
        const user2 = await User.findOne(
            { _id: user2Id },
            '-_id email',
        )
        if (!user2) {
            return
        }

        let chat = await Chat.findOne(
            {
                $and: [
                    { participants: user._id },
                    { participants: user2Id },
                ]
            },
            '_id',
        )
        if (!chat) {
            const participants = [
                user._id,
                user2Id,
            ]
            chat = new Chat({
                participants,
            })
            await chat.save()
            chat = { _id: chat._id.toString() }
        }

        io.sockets.in(user._id.toString()).emit('newChat', chat)
    })
}