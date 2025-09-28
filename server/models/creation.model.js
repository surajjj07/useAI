import mongoose from 'mongoose'

const CreationSchema = new mongoose.Schema({
    userId: { //refrence of User model
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    publish: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: [String],
        default: [],
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
},{timestamps:true})

const Creation = mongoose.model('Creation', CreationSchema)
export default Creation;