import { CreateBucketCommand, HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import app from './app';
import { createSchemas } from './db';
import AWS from 'aws-sdk';
import { fromEnv } from '@aws-sdk/credential-providers';


const PORT = process.env.PORT || 3001;
// const s3 = new AWS.S3({
//     region: 'us-east-1',  // Change to your preferred region
//     endpoint: 'http://localhost:4566',  // LocalStack endpoint
//     accessKeyId: 'test',      // Dummy access key
//     secretAccessKey: 'test',  // Dummy secret key
//     // s3ForcePathStyle: true,   // Ensure path-style URLs are used for LocalStack
//   });

export const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: 'http://localstack:4566',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '' 
    },
    forcePathStyle: true,
  });
  const bucketName = 'test-bucket';

  const createBucket = async () => {
    try {
      // Check if the bucket already exists
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket "${bucketName}" already exists.`);
    } catch (error:any) {
      if (error.name === 'NotFound') {
        // If the bucket doesn't exist, create it
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket "${bucketName}" created.`);
      } else {
        console.error(error);
      }
    }
  };
    
const startServer = async () => {
    try {
        await createSchemas(); // Create all schemas before starting the server
        console.log('Schemas created successfully');
        
        await createBucket();
        console.log('Bucket created successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Exit process if schema creation fails
    }
};

startServer();
