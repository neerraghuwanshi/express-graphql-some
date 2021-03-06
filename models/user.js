import mongoose from 'mongoose'


const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        token: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { 
        timestamps: true,
    }
)


export default mongoose.model('User', userSchema)