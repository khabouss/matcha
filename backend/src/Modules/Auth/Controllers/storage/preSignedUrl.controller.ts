import { Request, Response, NextFunction } from "express";
import GeneratePreSignedUrls from "../../../../Storage/GeneratePreSignedUrls";

const preSignedUrlController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Generate a unique key for the file
    const key = GeneratePreSignedUrls.GenerateKey();
    
    // Generate both upload and get URLs
    const { uploadUrl, getUrl } = await GeneratePreSignedUrls.generatePreSignedUrls(
      key,
      "test-bucket",
      3600 // 1 hour expiration for viewing
    );

    // Return both URLs and the key
    return res.status(200).json({
      status: "success",
      data: {
        uploadUrl,
        getUrl,
        key,
        bucket: "test-bucket",
        // The direct URL where the file will be accessible after upload
        fileUrl: `http://localstack:4566/test-bucket/${key}`
      }
    });
  } catch (error) {
    console.error("Error generating pre-signed URLs:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to generate URLs",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export default preSignedUrlController;
