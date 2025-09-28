import multer from 'multer';

// multer middleware for upload image
const storage = multer.diskStorage({}) //create multer storage

export const upload =multer({storage})