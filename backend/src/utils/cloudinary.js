import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import ApiError from './ApiError.js';
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        }
        )
        //console.log("file uploaded successfully on cloudinary : ", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (public_id) => {
    try {
        const response = await cloudinary.uploader.destroy(public_id)
        console.log("successfully deleted file from cloudinary : ");
        return response;
    } catch (error) {
        throw new ApiError(500, "Error deleting file from cloudinary")
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };


