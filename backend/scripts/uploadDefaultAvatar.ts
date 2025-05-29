import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { s3Client } from "../src";
import fs from "fs";
import path from "path";

const bucketName = "test-bucket";
const defaultAvatarKey = "default-avatar.svg";

const defaultAvatarSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Background Circle -->
    <circle cx="100" cy="100" r="100" fill="#E2E8F0"/>
    
    <!-- User Icon -->
    <circle cx="100" cy="85" r="35" fill="#94A3B8"/>
    <path d="M100 130C122.091 130 140 148.909 140 171V200H60V171C60 148.909 77.9086 130 100 130Z" fill="#94A3B8"/>
</svg>`;

async function uploadDefaultAvatar() {
    try {
        // Upload the default avatar to S3
        const params = {
            Bucket: bucketName,
            Key: defaultAvatarKey,
            Body: defaultAvatarSvg,
            ContentType: "image/svg+xml",
            ACL: ObjectCannedACL.public_read
        };

        await s3Client.send(new PutObjectCommand(params));
        console.log("Default avatar uploaded successfully!");
        console.log(`URL: http://localhost:4566/${bucketName}/${defaultAvatarKey}`);
    } catch (error) {
        console.error("Error uploading default avatar:", error);
    }
}

// Run the upload
uploadDefaultAvatar(); 