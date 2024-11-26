import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dsp3koxbb',
    api_key: "712128876688431",
    api_secret: "uBHazNFklotm0DLSNbS_0AdgAJ4"
});

// Create a storage engine to save the files in Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'uploads',
            public_id: `${Date.now()}-${file.originalname}`,
            format: 'jpg', // or any other format you want to use
        };
    },
});


const deleteFile = (publicId: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            publicId.trim(), // is the public_id field in the resource object
            { resource_type: 'image' }, //tell the resource type you wanna delete (image, raw, video)
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

export const upload = multer({ storage: storage });
