import mongoose from 'mongoose'

const connectDB = async () => {
    console.log("MONGO_URL:", process.env.MONGO_URL);
  //Database connection
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB")
}

export default connectDB