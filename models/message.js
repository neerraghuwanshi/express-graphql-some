import mongoose from 'mongoose'


const Schema = mongoose.Schema

const messageSchema = new Schema(
    {
        message: {
            type: String,
            required: true,
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        chat: {
            type: Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
        },
    },
    { 
        timestamps: true,
    }
)


export default mongoose.model('Message', messageSchema)