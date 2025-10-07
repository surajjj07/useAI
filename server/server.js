import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import aiRouter from './routes/aiRoute.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import userAuthRouter from './routes/userAuthRoutes.js'
const app = express()

app.use(cors({
    origin:'https://useaisite.onrender.com',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
await connectCloudinary()

app.get("/", (req, res) => {
    res.send("This is the server")
})


const PORT = process.env.PORT || 3000


app.use('/api/ai', aiRouter)
app.use('/api/user',userRouter)
app.use('/api/user-auth',userAuthRouter)

app.listen(PORT, () => {
    console.log("Server is started at",PORT)
    connectDB()
})