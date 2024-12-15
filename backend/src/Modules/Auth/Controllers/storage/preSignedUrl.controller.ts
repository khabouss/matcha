import { Request, Response, NextFunction } from "express";
import GeneratePreSignedUrls from "../../../../Storage/GeneratePreSignedUrls";

const preSignedUrlController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const key = GeneratePreSignedUrls.GenerateKey();

    const uploadfileImage = await GeneratePreSignedUrls.generatePreSignedUrls(
      key,
      "test-bucket",
      300
    );
    return res.status(200).json({
      message: "Pre-signed URL generated successfully",
      fileUrl: uploadfileImage,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    next(error);
  }
};

export default preSignedUrlController;
