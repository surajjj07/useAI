import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../config/token.js"

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existUser = await User.findOne({ email }) //find user
        
        if (existUser) {  //return if user exists
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        //Hashed password through real password and  salt number
        const salt = await bcrypt.genSalt(10) //generate salt number using bcrypt js
        const hashedPassword = await bcrypt.hash(password, salt)

        // create a new user in the database
        const newUser = await User.create({ name, email, password: hashedPassword }) 


        const token = generateToken(newUser) // generates token 
        res.cookie("token", token, {  //Store token in cookies
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })

        res.status(201).json({ success: true, message: "User created successfully", user: newUser })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })  // Find user

        if (!user) {
            return res.status(402).json({ success: false, message: "User not found" })
        }

        //check password 
        const isPasswordCorrect = await bcrypt.compare(password, user.password)    
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Incorrect password" })
        }

        const token = generateToken(user)  // Generates new token every time


        res.cookie("token", token, {    //Set token in the cookies
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })

        res.status(200).json({ success: true, message: "User logged in successfully", user })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {     //Clear token from cookies
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            path: "/",
        })
        res.status(200).json({ success: true, message: "User logged out successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
  



