import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import preSignedUrlController from "../Controllers/storage/preSignedUrl.controller";

const attachUplaodRoute = (router: Router): void => {
  router.post("/s3/presigned-url", preSignedUrlController);
};

export default attachUplaodRoute;
