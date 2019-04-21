import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


const storage = cloudStorage({
  cloudinary,
  folder: 'images',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});

const finalConfig = multer({ storage }).single('image');

export default finalConfig;
