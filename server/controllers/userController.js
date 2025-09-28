import Creation from "../models/creation.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


export const updateProfileImage = async (req, res) => {
    try {
        const userId = req.userId;

        // If using upload.single("image")
        const imagePath = req.file.path;

        // Upload to cloudinary
        const resultUpload = await cloudinary.uploader.upload(imagePath);

        // Delete local file after upload
        fs.unlinkSync(imagePath);

        // Update user with cloudinary URL
        const user = await User.findByIdAndUpdate(
            userId,
            { profileImg: resultUpload.secure_url },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "Image can't be updated" });
        }

        res.status(201).json({ success: true, message: "Profile Image Updated", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Image upload error" });
    }
};



export const getCurrentUser=async(req,res)=>{
    try {
        const id=req.userId //currents user's id extracted from token

        const user=await User.findById(id).select("-password") //Find user from user-id and leave password
        if(!user){ //if not exist return
            return res.status(500).json({success:false,message:"User is not recognized"})
        }

        return res.status(200).json({success:true,user}) ///send user to the frontend
    } catch (error) {
        return res.status(404).json({success:false,message:"User not found"})
    }
}




export const getUserCretions = async (req, res) => {
    try {
        const userId = req.userId;
        
        //find all cration of current user
        const creations=await Creation.find({userId}).sort({created_at:-1})

        res.status(200).json({success:true,creations}) //sent to frontend
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const getPublishedCretions = async (req, res) => {
    try {
       
        //find all published creation from database and sort descending
        const creations=await Creation.find({publish:true}).sort({created_at:-1})

        res.status(200).json({success:true,creations})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const toggleLikeCreations = async (req, res) => {
    try {
        const userId = req.userId; //user's id
        const { id } = req.body; //creation's id
          
        const creation = await Creation.findById(id)
        
        if (!creation) {
            return res.json({success:false,message:"Creation not found"})
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        //update like and unlike of creation
        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr)
            message= "Creation Unliked"
        } else {
            updatedLikes = [...currentLikes, userIdStr]
            message="Creation Liked"
        }

        const formattedArray = `{${updatedLikes.join(',')}}`;

        const updatedCreation = await Creation.findByIdAndUpdate(id, {likes:updatedLikes}, {new:true}) //update creation in database

        res.json({success:true,message})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


