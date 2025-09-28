import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim:true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        pattern: "^.+@.+\\..+$",
    },
    password: {
        type: String,
        require: true,
    },
    profileImg: {
        type:String,
    }
})


const User = mongoose.model('User',UserSchema)
export default User;