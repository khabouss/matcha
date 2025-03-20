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
    const userinfo = await UserRepository.findById(findProfile.user_id);
    const { id, isverified, password, created_At, ...user } = userinfo;
    findProfile.userinfo = user;
    const getimagesUser = await profileRepository.getProfileImages(
      findProfile.id
    );
    const images = getimagesUser.map((image: any) => image.image_url);
    findProfile.images = images;
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
    console.log("profile_views: ", profile_views);
    const profileViewersimages = await Promise.all(
      profile_views.map(async (viewer: any) => {
        const viewerProfile = await UserRepository.findById(viewer.id);
        const { password, created_At, isverified, id, email, ...user } =
          viewerProfile;
        const viewerImages = await profileRepository.getProfileImages(
          viewerProfile.id
        );
        const profileImage = viewerImages[0].image_url;
        //get gender only from profile
        const findProfile = await profileRepository.findProfileByUserId(
          viewerProfile.id
        );
        console.log("findProfile >>>>>>: ", findProfile);
        const {
          id: _,
          user_id,
          gps_location,
          allow_gps,
          fame_rating,
          sexual_preferences,
          biography,
          neighborhood,
          ...returndata
        } = findProfile;
        //

        return { ...user, profileImage, ...returndata };
      })
    );
    console.log("profileViewersimages: ", profileViewersimages);
    return profileViewersimages;
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
  static async updateProfile(profile: any) {
    const findProfile = await profileRepository.findProfileByUserId(
      profile.user_id
    );
    if (!findProfile) {
      throw new MatchaError("Profile not found", 404);
    }
    const updateProfile = await profileRepository.updateProfile(profile);
    if (!updateProfile) {
      throw new MatchaError("Profile not updated", 400);
    }
    console.log("profile: ", profile);

    // if (profile.fileName || profile.lastName || profile.email) {
    const updateUser = await UserRepository.UpdateUser(
      profile.user_id,
      profile.firstName,
      profile.lastName,
      profile.email
    );
    if (!updateUser) {
      throw new MatchaError("User not updated", 400);
    }
    if (profile.images.length !== 0) {
      const deleteImages = await profileRepository.deleteProfileImages(
        findProfile.id
      );
      if (!deleteImages) {
        throw new MatchaError("Images not deleted", 400);
      }
      for (let i = 0; i < profile.images.length; i++) {
        if (!profile.images[i]) {
          throw new MatchaError("Image url is required", 400);
        }
        const image = {
          profile_id: findProfile.id,
          image_url: profile.images[i],
        };
        const createImage = await profileRepository.putProfileImages(
          image.profile_id,
          image.image_url
        );
      }
    }
    return updateProfile;
  }
  // static async getSwipeList(userId: number) {
  //   try {
  //     const findProfile = await profileRepository.findProfileByUserId(userId);
  //     if (!findProfile) {
  //       throw new MatchaError("Profile not found", 404);
  //     }
  //     const swipeList = await profileRepository.getSwipeList(userId);
  //     console.log("swipeList: ", swipeList);
  //     const userinfoAndProfileImages = await Promise.all(
  //       swipeList.map(async (user: any) => {
  //         const users = await UserRepository.findById(user.id);
  //         // const { isverified, id, email, ...userdetails } = users;
  //         const profile = await profileRepository.findProfileByUserId(user.id);
  //         const profileImages = await profileRepository.getProfileImages(
  //           profile.id
  //         );
  //         const profileImage = profileImages[0].image_url;
  //         // const {
  //         //   id: _,
  //         //   user_id,
  //         //   // gps_location,
  //         //   // allow_gps,
  //         //   // fame_rating,
  //         //   // sexual_preferences,
  //         //   // biography,
  //         //   // neighborhood,
  //         //   ...returndata
  //         // } = profile;
  //         return { users, profileImage, profile };
  //       })
  //     );

  //     return userinfoAndProfileImages
  //       .filter(
  //         (user: any) =>
  //           user.profile.fame_rating >= findProfile.fame_rating &&
  //           user.profile.user_id !== userId
  //       )
  //       .map((user: any) => user.users);
  //   } catch (error: any) {
  //     throw new MatchaError(error.message, 500);
  //   }
  // }
  static async getSwipeList(
    userId: number,
    location?: { latitude?: number; longitude?: number }
  ) {
    try {
      // Find the current user's profile
      const findProfile = await profileRepository.findProfileByUserId(userId);
      if (!findProfile) {
        throw new MatchaError("Profile not found", 404);
      }

      // Get the initial swipe list from the database (excluding the current user) and with add filter gender if user man return only women and vice versa

      const swipeList = await profileRepository.getSwipeList(
        userId,
        findProfile.gender,
        location
      );

      // Validate swipe list
      if (!swipeList || swipeList.length === 0) {
        console.log("No potential matches found");

        return []; // Return empty array if no potential matches
      }

      // Fetch detailed user information with error handling
      const userinfoAndProfileImages = await Promise.all(
        swipeList.map(async (user: any) => {
          // Early validation
          if (!user || !user.id) {
            console.warn("Skipping invalid user in swipe list:", user);
            return null;
          }

          try {
            // Fetch user details
            const users = await UserRepository.findById(user.user_id);
            if (!users) {
              console.warn(`No user found for ID: ${user.user_id}`);
              return null;
            }
            console.log("users: ", users);
            const { password, email, ...userdetails } = users;

            // Fetch profile
            const profile = await profileRepository.findProfileByUserId(
              user.user_id
            );
            if (!profile) {
              console.warn(`No profile found for user ID: ${user.user_id}`);
              return null;
            }
            console.log("profile: ", profile);
            const { user_id, id: _, ...profileDetails } = profile;

            // Fetch profile images
            const profileImages = await profileRepository.getProfileImages(
              profile.id
            );
            // const profileImage =
            //   profileImages && profileImages.length > 0
            //     ? profileImages[0].image_url
            //     : null;
            const profileImage = profileImages.map(
              (image: any) => image.image_url
            );

            return {
              ...userdetails,
              myProfile: "dehbuwe",
              images: profileImage,
              ...profileDetails,
            };
          } catch (fetchError) {
            console.error(
              `Error fetching details for user ${user.id}:`,
              fetchError
            );
            return null;
          }
        })
      );

      // Filter out null results and apply additional filtering
      return userinfoAndProfileImages;
    } catch (error: any) {
      console.error("Error in getSwipeList:", error);
      throw new MatchaError(error.message, 500);
    }
  }
}

export default ProfileServices;
