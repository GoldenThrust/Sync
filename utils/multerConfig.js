import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary'
import "dotenv/config";
import process from 'process';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sync',
    format: async () => 'png',
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique filename
  },
});

const isFree = process.env.FREE === "TRUE";
const options = isFree ? { storage } : { dest: './uploads' };
const upload = multer(options);

export default upload;
