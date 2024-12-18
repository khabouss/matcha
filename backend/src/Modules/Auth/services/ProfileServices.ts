import MatchaError from "../../../Exceptions/MatchaError";
import profileRepository from "../repositories/profileRepository";
import { UserRepository } from "../repositories/userRepository";

class ProfileServices {
  static async createProfile(profile: any) {
    const finduser = await UserRepository.findById(profile.user_id);
    if (!finduser) {
      throw new MatchaError("User not found", 404);
    }
    const findProfile = await profileRepository.findProfileByUserId(
      profile.user_id
    );
    if (findProfile) {
      throw new MatchaError("Profile already exists", 400);
    }
    if (profile.images.length === 0) {
      throw new MatchaError("Profile images are required", 400);
    }
    const createProfile = await profileRepository.createProfile(profile);
    if (!createProfile) {
      throw new MatchaError("Profile not created", 400);
    }
    for (let i = 0; i < profile.images.length; i++) {
      if (!profile.images[i]) {
        throw new MatchaError("Image url is required", 400);
      }
      const image = {
        profile_id: createProfile.id,
        image_url: profile.images[i],
      };
      const createImage = await profileRepository.putProfileImages(
        image.profile_id,
        image.image_url
      );
    }
    // await profileRepository.putProfileImages(createProfile.id, profile.images);
    console.log("createProfile: ", createProfile);

    return createProfile;
  }
  static async getMyProfile(userId: number) {
    const findProfile = await profileRepository.findProfileByUserId(userId);
    if (!findProfile) {
      throw new MatchaError("Profile not found", 404);
    }
    return findProfile;
  }
  static async getProfileUsers(profileId: string) {
    // const findProfile = await profileRepository.findProfileById(profileId);
    const findProfile = await profileRepository.findProfileByUserNume(
      profileId
    );
    if (!findProfile) {
      throw new MatchaError("Profile not found", 404);
    }
    return findProfile;
  }
  static async setViewerProfile(profileId: number, viewerId: number) {
    const findProfile = await profileRepository.findProfileById(profileId);
    if (!findProfile) {
      throw new MatchaError("Profile not found", 404);
    }
    const setViewer = await profileRepository.setViewerProfile(
      profileId,
      viewerId
    );
    return setViewer;
  }
  static async verfiyProfileOwner(profileId: number, userId: number) {
    const checkProfileOwner = await profileRepository.verfiyProfileOwner(
      profileId,
      userId
    );
    if (!checkProfileOwner) {
      throw new MatchaError("You can only view your own profile viewers", 403);
    }
    const profile_views = await profileRepository.getProfileViews(profileId);
    return profile_views;
  }
  static async getMyProfileDetails(userId: number) {
    const findProfile = await profileRepository.findProfileByUserId(userId);
    if (!findProfile) {
      throw new MatchaError("Profile not found", 404);
    }
    console.log("findProfile: ", findProfile);
    const { user_id, gps_location, allow_gps, fame_rating, ...returndata } =
      findProfile;
    const retrieveImages = await profileRepository.getProfileImages(
      findProfile.id
    );
    // returndata.profile_images = retrieveImages;
    const images = retrieveImages.map((image: any) => image.image_url);
    returndata.images = images;

    return returndata;
  }
}

export default ProfileServices;
