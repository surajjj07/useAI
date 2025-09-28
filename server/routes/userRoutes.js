import express from 'express'
import { auth } from '../middlewares/auth.js'
import { getCurrentUser, getPublishedCretions, getUserCretions, toggleLikeCreations, updateProfileImage } from '../controllers/userController.js'
import { upload } from '../config/multer.js'

const userRouter = express.Router()

userRouter.get('/get-current-user',auth,getCurrentUser)
userRouter.get('/get-user-creations',auth,getUserCretions)
userRouter.get('/get-published-creations',auth,getPublishedCretions)
userRouter.post('/toggle-like-creations', auth, toggleLikeCreations)
userRouter.post('/update-profile',upload.single("image"),auth,updateProfileImage)

export default userRouter