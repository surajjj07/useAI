import mongoose from 'mongoose'

const connectDB = async () => {  //Database connection 
    await mongoose.connect(process.env.DB_URL)
    console.log("Connected to MongoDB")
}

export default connectDB