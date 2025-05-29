import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import app from "./app";
import { createSchemas } from "./db";
import AWS from "aws-sdk";
import { fromEnv } from "@aws-sdk/credential-providers";

const PORT = process.env.PORT || 3001;
// const s3 = new AWS.S3({
//     region: 'us-east-1',  // Change to your preferred region
//     endpoint: 'http://localhost:4566',  // LocalStack endpoint
//     accessKeyId: 'test',      // Dummy access key
//     secretAccessKey: 'test',  // Dummy secret key
//     // s3ForcePathStyle: true,   // Ensure path-style URLs are used for LocalStack
//   });

export const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localstack:4566",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  forcePathStyle: true,
});
const bucketName = "test-bucket";

const setBucketCors = async (bucketName: string) => {
  const corsParams = {
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: [
            "*",
            "Content-Type",
            "x-amz-acl",
            "x-amz-content-sha256",
            "x-amz-date",
            "x-amz-security-token",
            "Origin"
          ],
          AllowedMethods: ["PUT", "GET", "POST", "HEAD", "DELETE"],
          AllowedOrigins: ["http://localhost:3002"],
          ExposeHeaders: [
            "ETag",
            "Content-Length",
            "Content-Type",
            "x-amz-request-id",
            "x-amz-id-2"
          ],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  };

  try {
    await s3Client.send(new PutBucketCorsCommand(corsParams));
    console.log("CORS configuration applied successfully.");
  } catch (error) {
    console.error("Error setting CORS configuration:", error);
  }
};

const setBucketPolicy = async (bucketName: string) => {
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      },
      {
        Sid: "PublicWritePutObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:PutObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };

  try {
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy)
    }));
    console.log("Bucket policy applied successfully.");
  } catch (error) {
    console.error("Error setting bucket policy:", error);
  }
};

const createBucket = async () => {
  try {
    // Check if the bucket already exists
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" already exists.`);
    await setBucketCors(bucketName);
    await setBucketPolicy(bucketName);
  } catch (error: any) {
    if (error.name === "NotFound") {
      // If the bucket doesn't exist, create it
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket "${bucketName}" created.`);
      await setBucketCors(bucketName);
      await setBucketPolicy(bucketName);
    } else {
      console.error(error);
    }
  }
};

const startServer = async () => {
  try {
    await createSchemas(); // Create all schemas before starting the server
    console.log("Schemas created successfully");
    await createBucket();
    console.log("Bucket created successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit process if schema creation fails
  }
};

startServer();
