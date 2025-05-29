"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MatchaError_1 = __importDefault(require("../../../Exceptions/MatchaError"));
const profileRepository_1 = __importDefault(require("../repositories/profileRepository"));
const userRepository_1 = require("../repositories/userRepository");
class ProfileServices {
    static createProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const finduser = yield userRepository_1.UserRepository.findById(profile.user_id);
            if (!finduser) {
                throw new MatchaError_1.default("User not found", 404);
            }
            const findProfile = yield profileRepository_1.default.findProfileByUserId(profile.user_id);
            if (findProfile) {
                throw new MatchaError_1.default("Profile already exists", 400);
            }
            if (profile.images.length === 0) {
                throw new MatchaError_1.default("Profile images are required", 400);
            }
            const createProfile = yield profileRepository_1.default.createProfile(profile);
            if (!createProfile) {
                throw new MatchaError_1.default("Profile not created", 400);
            }
            for (let i = 0; i < profile.images.length; i++) {
                if (!profile.images[i]) {
                    throw new MatchaError_1.default("Image url is required", 400);
                }
                const image = {
                    profile_id: createProfile.id,
                    image_url: profile.images[i],
                };
                const createImage = yield profileRepository_1.default.putProfileImages(image.profile_id, image.image_url);
            }
            // await profileRepository.putProfileImages(createProfile.id, profile.images);
            console.log("createProfile: ", createProfile);
            return createProfile;
        });
    }
    static getMyProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findProfile = yield profileRepository_1.default.findProfileByUserId(userId);
            if (!findProfile) {
                throw new MatchaError_1.default("Profile not found", 404);
            }
            const userinfo = yield userRepository_1.UserRepository.findById(findProfile.user_id);
            const { id, isverified, password, created_At } = userinfo, user = __rest(userinfo, ["id", "isverified", "password", "created_At"]);
            findProfile.userinfo = user;
            const getimagesUser = yield profileRepository_1.default.getProfileImages(findProfile.id);
            const images = getimagesUser.map((image) => image.image_url);
            findProfile.images = images;
            return findProfile;
        });
    }
    static getProfileUsers(profile_username) {
        return __awaiter(this, void 0, void 0, function* () {
            const finduser = yield userRepository_1.UserRepository.findByUserName(profile_username);
            console.log("finduser: ", finduser);
            if (!finduser) {
                throw new MatchaError_1.default("User not found", 404);
            }
            // const findProfile = await profileRepository.findProfileById(profileId);
            const findProfile = yield profileRepository_1.default.findProfileByUserNume(String(finduser.id));
            if (!findProfile) {
                throw new MatchaError_1.default("Profile not found", 404);
            }
            console.log("findProfile:>>>>>>>>>>>>::::>>>: ", findProfile);
            const getimagesUser = yield profileRepository_1.default.getProfileImages(findProfile.id);
            const images = getimagesUser.map((image) => image.image_url);
            findProfile.images = images;
            const userinfo = yield userRepository_1.UserRepository.findById(findProfile.user_id);
            const { id, isverified, password, created_At } = userinfo, user = __rest(userinfo, ["id", "isverified", "password", "created_At"]);
            findProfile.userinfo = user;
            return findProfile;
        });
    }
    static setViewerProfile(profileId, viewerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findProfile = yield profileRepository_1.default.findProfileById(profileId);
            if (!findProfile) {
                throw new MatchaError_1.default("Profile not found", 404);
            }
            const setViewer = yield profileRepository_1.default.setViewerProfile(profileId, viewerId);
            return setViewer;
        });
    }
    static verfiyProfileOwner(profileId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkProfileOwner = yield profileRepository_1.default.verfiyProfileOwner(profileId, userId);
            if (!checkProfileOwner) {
                throw new MatchaError_1.default("You can only view your own profile viewers", 403);
            }
            const profile_views = yield profileRepository_1.default.getProfileViews(profileId);
            console.log("profile_views: ", profile_views);
            const profileViewersimages = yield Promise.all(profile_views.map((viewer) => __awaiter(this, void 0, void 0, function* () {
                const viewerProfile = yield userRepository_1.UserRepository.findById(viewer.id);
                const { password, created_At, isverified, id, email } = viewerProfile, user = __rest(viewerProfile, ["password", "created_At", "isverified", "id", "email"]);
                const viewerImages = yield profileRepository_1.default.getProfileImages(viewerProfile.id);
                const profileImage = viewerImages[0].image_url;
                //get gender only from profile
                const findProfile = yield profileRepository_1.default.findProfileByUserId(viewerProfile.id);
                console.log("findProfile >>>>>>: ", findProfile);
                const { id: _, user_id, gps_location, allow_gps, fame_rating, sexual_preferences, biography, neighborhood } = findProfile, returndata = __rest(findProfile, ["id", "user_id", "gps_location", "allow_gps", "fame_rating", "sexual_preferences", "biography", "neighborhood"]);
                //
                return Object.assign(Object.assign(Object.assign({}, user), { profileImage }), returndata);
            })));
            console.log("profileViewersimages: ", profileViewersimages);
            return profileViewersimages;
        });
    }
    static getMyProfileDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findProfile = yield profileRepository_1.default.findProfileByUserId(userId);
            if (!findProfile) {
                throw new MatchaError_1.default("Profile not found", 404);
            }
            console.log("findProfile: ", findProfile);
            const { user_id, gps_location, allow_gps, fame_rating } = findProfile, returndata = __rest(findProfile, ["user_id", "gps_location", "allow_gps", "fame_rating"]);
            const retrieveImages = yield profileRepository_1.default.getProfileImages(findProfile.id);
            // returndata.profile_images = retrieveImages;
            const images = retrieveImages.map((image) => image.image_url);
            returndata.images = images;
            return returndata;
        });
    }
    static updateProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const findProfile = yield profileRepository_1.default.findProfileByUserId(profile.user_id);
            if (!findProfile) {
                throw new MatchaError_1.default("Profile not found", 404);
            }
            const updateProfile = yield profileRepository_1.default.updateProfile(profile);
            if (!updateProfile) {
                throw new MatchaError_1.default("Profile not updated", 400);
            }
            console.log("profile: ", profile);
            // if (profile.fileName || profile.lastName || profile.email) {
            const updateUser = yield userRepository_1.UserRepository.UpdateUser(profile.user_id, profile.firstName, profile.lastName, profile.email);
            if (!updateUser) {
                throw new MatchaError_1.default("User not updated", 400);
            }
            if (profile.images.length !== 0) {
                const deleteImages = yield profileRepository_1.default.deleteProfileImages(findProfile.id);
                if (!deleteImages) {
                    throw new MatchaError_1.default("Images not deleted", 400);
                }
                for (let i = 0; i < profile.images.length; i++) {
                    if (!profile.images[i]) {
                        throw new MatchaError_1.default("Image url is required", 400);
                    }
                    const image = {
                        profile_id: findProfile.id,
                        image_url: profile.images[i],
                    };
                    const createImage = yield profileRepository_1.default.putProfileImages(image.profile_id, image.image_url);
                }
            }
            return updateProfile;
        });
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
    static getSwipeList(userId, location) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the current user's profile
                const findProfile = yield profileRepository_1.default.findProfileByUserId(userId);
                if (!findProfile) {
                    throw new MatchaError_1.default("Profile not found", 404);
                }
                // Get the initial swipe list from the database (excluding the current user) and with add filter gender if user man return only women and vice versa
                const swipeList = yield profileRepository_1.default.getSwipeList(userId, findProfile.gender, location);
                // Validate swipe list
                if (!swipeList || swipeList.length === 0) {
                    console.log("No potential matches found");
                    return []; // Return empty array if no potential matches
                }
                // Fetch detailed user information with error handling
                const userinfoAndProfileImages = yield Promise.all(swipeList.map((user) => __awaiter(this, void 0, void 0, function* () {
                    // Early validation
                    if (!user || !user.id) {
                        console.warn("Skipping invalid user in swipe list:", user);
                        return null;
                    }
                    try {
                        // Fetch user details
                        const users = yield userRepository_1.UserRepository.findById(user.user_id);
                        if (!users) {
                            console.warn(`No user found for ID: ${user.user_id}`);
                            return null;
                        }
                        console.log("users: ", users);
                        const { password, email } = users, userdetails = __rest(users, ["password", "email"]);
                        // Fetch profile
                        const profile = yield profileRepository_1.default.findProfileByUserId(user.user_id);
                        if (!profile) {
                            console.warn(`No profile found for user ID: ${user.user_id}`);
                            return null;
                        }
                        console.log("profile: ", profile);
                        const { user_id, id: _ } = profile, profileDetails = __rest(profile, ["user_id", "id"]);
                        // Fetch profile images
                        const profileImages = yield profileRepository_1.default.getProfileImages(profile.id);
                        // const profileImage =
                        //   profileImages && profileImages.length > 0
                        //     ? profileImages[0].image_url
                        //     : null;
                        const profileImage = profileImages.map((image) => image.image_url);
                        return Object.assign(Object.assign(Object.assign({}, userdetails), { myProfile: findProfile, images: profileImage }), profileDetails);
                    }
                    catch (fetchError) {
                        console.error(`Error fetching details for user ${user.id}:`, fetchError);
                        return null;
                    }
                })));
                // Filter out null results and apply additional filtering
                return userinfoAndProfileImages;
            }
            catch (error) {
                console.error("Error in getSwipeList:", error);
                throw new MatchaError_1.default(error.message, 500);
            }
        });
    }
}
exports.default = ProfileServices;
