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
  static async getProfileUsers(profile_username: string) {
    const finduser = await UserRepository.findByUserName(profile_username);
    console.log("finduser: ", finduser);
    if (!finduser) {
      throw new MatchaError("User not found", 404);
    }

    // const findProfile = await profileRepository.findProfileById(profileId);
    const findProfile = await profileRepository.findProfileByUserNume(
      String(finduser.id)
    );
    if (!findProfile) {
      throw new MatchaError("Profile not found", 404);
    }
    console.log("findProfile:>>>>>>>>>>>>::::>>>: ", findProfile);
    const getimagesUser = await profileRepository.getProfileImages(
      findProfile.id
    );
    const images = getimagesUser.map((image: any) => image.image_url);
    findProfile.images = images;
    const userinfo = await UserRepository.findById(findProfile.user_id);
    const { id, isverified, password, created_At, ...user } = userinfo;
    findProfile.userinfo = user;
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

    // Update the profile with all fields including interests
    const updateProfile = await profileRepository.updateProfile({
      ...profile,
      interests: Array.isArray(profile.interests) ? profile.interests : []
    });

    if (!updateProfile) {
      throw new MatchaError("Profile not updated", 400);
    }

    // Update user information
    const updateUser = await UserRepository.UpdateUser(
      profile.user_id,
      profile.firstName,
      profile.lastName,
      profile.email
    );
    if (!updateUser) {
      throw new MatchaError("User not updated", 400);
    }

    // Handle images - only update if there are new images
    const validImages = profile.images.filter((img: string) => img !== null && img !== '');
    if (validImages.length > 0) {
      // Delete existing images
      await profileRepository.deleteProfileImages(findProfile.id);
      
      // Add new images
      for (const imageUrl of validImages) {
        await profileRepository.putProfileImages(
          findProfile.id,
          imageUrl
        );
      }
    }

    // Get the updated profile with all fields
    const updatedProfile = await this.getMyProfile(profile.user_id);
    return updatedProfile;
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
              myProfile: findProfile,
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
  static async likeProfile(likerUserId: number, likedProfileId: number) {
    try {
      // Check if the liker has a profile with images
      const likerProfile = await profileRepository.findProfileByUserId(likerUserId);
      if (!likerProfile) {
        throw new MatchaError("You must have a profile to like others", 400);
      }

      const likerImages = await profileRepository.getProfileImages(likerProfile.id);
      if (!likerImages || likerImages.length === 0) {
        throw new MatchaError("You must have at least one profile picture to like others", 400);
      }

      // Check if the liked profile exists
      const likedProfile = await profileRepository.findProfileById(likedProfileId);
      if (!likedProfile) {
        throw new MatchaError("Profile not found", 404);
      }

      // Add the like
      const like = await profileRepository.likeProfile(likerUserId, likedProfileId);
      
      // Check if it's a match
      const isMatch = await profileRepository.checkMatch(likerUserId, likedProfileId);
      
      // Get the liked profile's user info for the response
      const likedUser = await UserRepository.findById(likedProfile.user_id);
      const { password, ...userInfo } = likedUser;

      return {
        like,
        isMatch,
        likedProfile: {
          ...likedProfile,
          user: userInfo
        }
      };
    } catch (error: any) {
      throw new MatchaError(error.message, error.statusCode || 500);
    }
  }

  static async getMatches(userId: number) {
    try {
      const matches = await profileRepository.getMatches(userId);
      
      // Get profile images for each match
      const matchesWithImages = await Promise.all(
        matches.map(async (match) => {
          const images = await profileRepository.getProfileImages(match.profile_id);
          return {
            ...match,
            images: images.map(img => img.image_url)
          };
        })
      );

      return matchesWithImages;
    } catch (error: any) {
      throw new MatchaError(error.message, error.statusCode || 500);
    }
  }

  static async getLikedProfiles(userId: number) {
    try {
      const likedProfiles = await profileRepository.getLikedProfiles(userId);
      
      // Get profile images for each liked profile
      const profilesWithImages = await Promise.all(
        likedProfiles.map(async (profile) => {
          const images = await profileRepository.getProfileImages(profile.id);
          return {
            ...profile,
            images: images.map(img => img.image_url)
          };
        })
      );

      return profilesWithImages;
    } catch (error: any) {
      throw new MatchaError(error.message, error.statusCode || 500);
    }
  }

  static async unmatchProfile(userId: number, unmatchedProfileId: number) {
    // Verify both profiles exist
    const userProfile = await profileRepository.findProfileByUserId(userId);
    const unmatchedProfile = await profileRepository.findProfileByUserId(unmatchedProfileId);

    if (!userProfile || !unmatchedProfile) {
      throw new MatchaError('Profile not found', 404);
    }

    // Remove the like connection between both profiles
    await profileRepository.unmatchProfile(userId, unmatchedProfileId);
  }
}

export default ProfileServices;
