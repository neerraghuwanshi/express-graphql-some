import mongoose from 'mongoose'


const Schema = mongoose.Schema

const unverifiedUserSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
    },
    { 
        timestamps: true,
    }
)


export default mongoose.model('UnverifiedUser', unverifiedUserSchema)