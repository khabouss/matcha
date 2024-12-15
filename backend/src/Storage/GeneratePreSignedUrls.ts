import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "..";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";

class GeneratePreSignedUrls {
  static escapeRegExp = (word: string) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  static GenerateKey = () =>
    v4().replace(new RegExp(GeneratePreSignedUrls.escapeRegExp("-"), "g"), "");

  static async generatePreSignedUrls(
    fileKeys: string,
    bucketName: string,
    expiration: number
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKeys,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expiration,
    });

    return url.replace("localstack", "localhost").split("?")[0];

  }
}

export default GeneratePreSignedUrls;
