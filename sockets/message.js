import mongoose from 'mongoose'

import Chat from '../models/chat'
import Message from '../models/message'
import { authenticate } from './helpers/auth'


export const messageFunctions = (socket, io) => {
    socket.on('fetchMessages', async (data) => {
        const user = await authenticate(data)
        if (!user) {
            return
        }

        let messages = await Message.find(
            { chat: mongoose.Types.ObjectId(data.chatId) },
            'message from',
        ).populate(
            'from',
            '-_id email',
        )

        io.sockets.in(user._id.toString()).emit('messages', messages)
    })

    socket.on('addMessage', async (data) => {
        const user = await authenticate(data, 'email')
        if (!user) {
            return
        }
        
        const chatId = mongoose.Types.ObjectId(data.chatId)
        const chat = await Chat.findOne(
            { _id: chatId },
            'participants',
        )
        .populate('participants', 'email')
        if (!chat) {
            return
        }
        
        const participants = chat.participants.map(item => item._id.toString())
        if (!participants.includes(user._id.toString())) {
            return
        }

        const lastMessage = new Message({
            from: user,
            chat: chatId,
            message: data.message,
        })
        await lastMessage.save()

        chat.lastMessage = lastMessage._id
        await chat.save()

        const response = {
            _id: data.chatId,
            lastMessage: {
                _id: lastMessage._id.toString(),
                from: { email: lastMessage.from.email },
                message: lastMessage.message,
            },
            participants: chat.participants.map(item => ({ 
                email: item.email 
            })),
        }
        for (let participant of participants) {
            io.sockets.in(participant).emit('newMessage', response)
        }
    })
}