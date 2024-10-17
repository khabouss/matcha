import MatchaError from '../../../Exceptions/MatchaError';
import profileRepository from '../repositories/profileRepository';
import { UserRepository } from '../repositories/userRepository';

class ProfileServices {
    static async createProfile(profile: any) {
        const finduser = await UserRepository.findById(profile.user_id);
        if (!finduser) {
            throw new MatchaError('User not found', 404);
        }
        const findProfile = await profileRepository.findProfileByUserId(
            profile.user_id
        );
        if (findProfile) {
            throw new MatchaError('Profile already exists', 400);
        }
        const createProfile = await profileRepository.createProfile(profile);
        console.log('createProfile: ', createProfile);

        return createProfile;
    }
    static async getMyProfile(userId: number) {
        const findProfile = await profileRepository.findProfileByUserId(userId);
        if (!findProfile) {
            throw new MatchaError('Profile not found', 404);
        }
        return findProfile;
    }
    static async getProfileUsers(profileId: number) {
        const findProfile = await profileRepository.findProfileById(profileId);
        if (!findProfile) {
            throw new MatchaError('Profile not found', 404);
        }
        return findProfile;
    }
    static async setViewerProfile(profileId: number, viewerId: number) {
        const findProfile = await profileRepository.findProfileById(profileId);
        if (!findProfile) {
            throw new MatchaError('Profile not found', 404);
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
            throw new MatchaError(
                'You can only view your own profile viewers',
                403
            );
        }
        const profile_views = await profileRepository.getProfileViews(
            profileId
        );
        return profile_views;
    }
}

export default ProfileServices;
