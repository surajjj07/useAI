
import jwt from 'jsonwebtoken'
//Middleware to check if user is logged in
export const auth = async (req, res, next) => {
    let { token } = req.cookies //take token from cookies
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized please login to continue" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) //verify token , it return user
    req.userId = decoded.UserId // extract user id from user
    next() //move to route controller
}