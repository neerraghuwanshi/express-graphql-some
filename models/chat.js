import mongoose from 'mongoose'


const Schema = mongoose.Schema

const chatSchema = new Schema(
    {
        participants: [{
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        lastMessage: {
            type: mongoose.Types.ObjectId,
            ref: 'Message',
            required: false,
        }
    },
    { 
        timestamps: true,
    }
)


export default mongoose.model('Chat', chatSchema)