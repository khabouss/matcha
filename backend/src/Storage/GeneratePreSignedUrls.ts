import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "..";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";

class GeneratePreSignedUrls {
  static escapeRegExp = (word: string) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  static GenerateKey = () =>
    v4().replace(new RegExp(GeneratePreSignedUrls.escapeRegExp("-"), "g"), "");

  static async generateUploadUrl(
    fileKeys: string,
    bucketName: string,
    expiration: number
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKeys,
      ContentType: 'image/*',
      ACL: 'public-read'
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expiration,
      signableHeaders: new Set([
        'host',
        'content-type',
        'x-amz-acl',
        'x-amz-content-sha256',
        'x-amz-date',
        'x-amz-security-token',
        'origin'
      ]),
      additionalHeaders: {
        'x-amz-acl': 'public-read',
        'origin': 'http://localhost:3002'
      }
    });

    // Replace localstack with localhost for browser access
    return url.replace('localstack:4566', 'localhost:4566');
  }

  static async generateGetUrl(
    fileKeys: string,
    bucketName: string,
    expiration: number
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKeys,
      ResponseContentType: 'image/*',
      ResponseContentDisposition: 'inline'
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expiration,
      signableHeaders: new Set([
        'host',
        'response-content-type',
        'response-content-disposition'
      ])
    });

    // Replace localstack with localhost for browser access
    return url.replace('localstack:4566', 'localhost:4566');
  }

  // For backward compatibility
  static async generatePreSignedUrls(
    fileKeys: string,
    bucketName: string,
    expiration: number
  ): Promise<{ uploadUrl: string; getUrl: string }> {
    const [uploadUrl, getUrl] = await Promise.all([
      this.generateUploadUrl(fileKeys, bucketName, expiration),
      this.generateGetUrl(fileKeys, bucketName, expiration)
    ]);

    return { uploadUrl, getUrl };
  }
}

export default GeneratePreSignedUrls;
