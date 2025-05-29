import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import ProfileServices from "../services/ProfileServices";

const router = Router();

// Like a profile
const likeProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });
      return;
    }

    const { profileId } = req.params;
    const result = await ProfileServices.likeProfile(req.user.id, parseInt(profileId));

    res.status(200).json({
      status: "success",
      data: result
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      error_message: error.message,
    });
    next(error);
  }
};

// Get user's matches
const getMatches: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });
      return;
    }

    const matches = await ProfileServices.getMatches(req.user.id);

    res.status(200).json({
      status: "success",
      data: matches
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      error_message: error.message,
    });
    next(error);
  }
};

// Get user's liked profiles
const getLikedProfiles: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });
      return;
    }

    const likedProfiles = await ProfileServices.getLikedProfiles(req.user.id);

    res.status(200).json({
      status: "success",
      data: likedProfiles
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      error_message: error.message,
    });
    next(error);
  }
};

const unmatchProfile: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        error_message: "Unauthorized",
      });
      return;
    }

    const userId = req.user.id;
    const unmatchedProfileId = parseInt(req.params.profileId);

    if (isNaN(unmatchedProfileId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid profile ID'
      });
      return;
    }

    await ProfileServices.unmatchProfile(userId, unmatchedProfileId);

    res.json({
      status: 'success',
      message: 'Profile unmatched successfully'
    });
  } catch (error: any) {
    console.error('Error unmatching profile:', error);
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'Error unmatching profile'
    });
  }
};

router.post("/like/:profileId", authMiddleware, likeProfile);
router.get("/matches", authMiddleware, getMatches);
router.get("/liked", authMiddleware, getLikedProfiles);
router.post('/unmatch/:profileId', authMiddleware, unmatchProfile);

export default router; 