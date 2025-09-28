import express from 'express'
import { signup, login, logout } from '../controllers/userAuthController.js'


const userAuthRouter = express.Router()

userAuthRouter.post('/signup', signup)
userAuthRouter.post('/login', login)
userAuthRouter.post('/logout', logout)


export default userAuthRouter