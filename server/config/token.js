import jwt from 'jsonwebtoken'

export const generateToken = (user) => { //generate token
    return jwt.sign({UserId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
