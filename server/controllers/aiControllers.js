import OpenAI from "openai";
import axios from 'axios'
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import pdf from 'pdf-parse/lib/pdf-parse.js';
import Creation from "../models/creation.model.js";

const AI = new OpenAI({
    apiKey:process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"  //OpenAI API for creating chat result
});

export const generateArticle = async (req, res) => {
    try {
        const { prompt, length } = req.body;
        const userId = req.userId;  // Current user's id

        //Create response with user's prompt using api
        const response = await AI.chat.completions.create({ 
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,  //accuracy of chat
            max_tokens:length
        });
        
        const content=response.choices[0].message.content  //choose choice from array

        const newCreation = await Creation.create({ userId, prompt, content, type: 'article' }) //create creation i database
    
        res.status(201).json({success:true,message:"Article generated successfully",content})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false,message:error.message})
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { prompt} = req.body;
        const userId = req.userId;
       
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens:100
        });
        
        const content=response.choices[0].message.content

        const newCreation = await Creation.create({ userId, prompt, content, type: 'blog-title' })
    
        res.status(201).json({success:true,message:"Blog title generated successfully",content})

    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}


export const generateImage = async (req, res) => {
    try {
        const { prompt,publish } = req.body;
        const userId = req.userId;
        
        const formData = new FormData() //create formdata
        formData.append('prompt', prompt)


        //image generation using clipdrop API 
        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType:"arraybuffer"
        })
        
        //convert binary data of image into base64 image
        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
        
        const {secure_url}=await cloudinary.uploader.upload(base64Image) //upload image on cloudinary 

        const newCreation = await Creation.create({ userId, prompt, content:secure_url, type: 'image', publish: publish ?? false }) //create a new creation in database
       
        res.status(201).json({success:true,message:"Image generated successfully",content:secure_url})

    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}


export const removeBackground = async (req, res) => {
    try {
        const userId = req.userId;
        const image = req.file; //take image from multer middleware
        
       //upload image on cloudinary and transform image with special effect background removal
        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [{
                effect: 'background_removal',
                background_removal: 'remove_the_background'
            }]
        })

        const newCreation = await Creation.create({ userId, prompt: 'Remove background from image', content: secure_url, type: 'image' }) //create creation in the database
       
        res.status(201).json({success:true,message:"Background removed successfully",content:secure_url})
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}



export const removeIMageObject = async (req, res) => {
    try {
        const userId = req.userId;
        const image  = req.file; //image
        const { object } = req.body;

        //upload image on cloudinary and stored the url of the image
        const { public_id } = await cloudinary.uploader.upload(image.path)

        //transform imamge using effects of cloudinary 
        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        })

        const newCreation = await Creation.create({ userId, prompt: `Remove ${object} from image`, content: imageUrl, type: 'image' })
       
        res.status(201).json({ success: true, message:"Object removed successfully", content: imageUrl })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

export const reviewResume = async (req, res) => {
    try {
        const userId = req.userId;
        const resume = req.file;
        // const plan = req.plan;

        // if (plan !== 'premium') {
        //     return res.json({success:false,message:"This feature is only available for premium subscriptions."})
        // }
       
        if (resume.size > 5 * 1024 * 1024) { //check size of resume 
           return res.json({success:false,message:"Resume file size exceeds allowed size (5MB)."})
        }


        // read the resume and return buffer(A special object which holds raw binary data)
        const dataBuffer = fs.readFileSync(resume.path) 
        
        //parse data and gives text
        const pdfData = pdf(dataBuffer) 
        
        const prompt = ` Review the following resume and provide constructive feedback on its strength, weekness, and areas for improvement. Resume Content:\n\n${(pdfData.text)}`
        

        //review text using api
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens:1000
        });

        const content=response.choices[0].message.content

        const newCreation= await Creation.create({userId,prompt:"Review the uploaded resume",content,type:"Resume review"})
       
        res.status(201).json({success:true,message:"Resume reviewed successfully",content})

    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}