import { Request, Response, NextFunction } from 'express';
import ProfileServices from '../../services/ProfileServices';
import { s3Client } from '../../../..';
import { PutObjectCommand } from '@aws-sdk/client-s3';
const bucketName = 'test-bucket';
const createProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('user: ', req.user);

    const {
        gender,
        sexual_preferences,
        biography,
        fame_rating,
        gps_location,
        neighborhood,
        allow_gps,
    } = req.body;

    console.log('req.body: ', req.body);
    const uploadedFiles = [];

    try {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                error_message: 'Unauthorized',
            });
            return;
        }
        // Check if files were uploaded
        const files = req.files || (req.file ? [req.file] : []);
        console.log('files: ', files);

        if (files.length === 0) {
            res.status(400).json({
                status: 'error',
                error_message: 'No files uploaded',
            });
        }

        

        if (Array.isArray(req.files) && req.files.length > 0) {
            const files = req.files as Express.Multer.File[];
            
      
            // Process each uploaded file (e.g., upload to S3)
            for (const file of files) {
              const fileName = `${Date.now()}-${file.originalname}`;
              const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
              };
      
              // Upload the file to S3 (using your s3Client logic)
              const data = await s3Client.send(new PutObjectCommand(params));
              console.log('File uploaded successfully:', data);
      
              uploadedFiles.push({
                fileName: fileName,
                fileUrl: `http://localhost:4566/${bucketName}/${fileName}`, // Adjust for AWS or LocalStack
              });
            }
        }

        
        const images = uploadedFiles.map((file) => file.fileUrl);
        console.log('images: ', images);
        const dataProfile = {
            user_id: req.user.id,
            gender,
            sexual_preferences,
            biography,
            fame_rating,
            gps_location,
            neighborhood,
            allow_gps,
        };
        const profile = await ProfileServices.createProfile(dataProfile);
        console.log('profile: ', profile);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Profile created successfully!',
                uploadedFiles,
            },
        });
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            error_message: error.message,
        });
        next(error);
    }
};

export default createProfileController;
