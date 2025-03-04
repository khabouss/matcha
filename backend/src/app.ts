import express, { NextFunction, Request, Response } from "express";
import attachAuthRoute from "./Modules/Auth/Routes/Auth.route";
import attachProfileRoute from "./Modules/Auth/Routes/Profile.route";
import webPush from "web-push";
import cors from "cors";
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { s3Client } from "./index";
import multer from "multer";
import { exceptionHandler } from "./middleware/exceptionHandler";
import attachUplaodRoute from "./Modules/Auth/Routes/Uplaod.route";
import seedDatabase from "./db/addDataToDatabase";

const bucketName = "test-bucket";

// Set up multer for file upload
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.post(
  "/upload-imge",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
    };
    try {
      // Upload the file to S3
      const data = await s3Client.send(new PutObjectCommand(params));
      console.log("File uploaded successfully:", data);
      return res.status(200).json({
        message: "File uploaded successfully",
        fileName: fileName,
        fileUrl: `http://localstack:4566/${bucketName}/${fileName}`, // URL for LocalStack, adjust if using AWS
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      // return res.status(500).send('Error uploading file');
      next(error);
    }
  }
);

const authRouter = express.Router();
const profileRouter = express.Router();
const uplaodRouter = express.Router();

/** AUTH */
attachAuthRoute(authRouter);
/** PROFILE */
attachProfileRoute(profileRouter);
/** UPLOAD */
attachUplaodRoute(uplaodRouter);
// seedDatabase();


app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/upload", uplaodRouter);


// write script that can insert data into the database

app.use(exceptionHandler);

export default app;
