import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "user-profiles",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "ico",
            "webp", "mp4", "mov", "avi", "webm", "mkv", "flv", "wmv", "mpeg", "3gp"],
        resource_type: "auto",
    },
});


const upload = multer({ storage });
export { cloudinary, upload };
