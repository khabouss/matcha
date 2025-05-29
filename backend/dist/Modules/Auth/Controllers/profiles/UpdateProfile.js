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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProfileServices_1 = __importDefault(require("../../services/ProfileServices"));
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                error_message: "Unauthorized",
            });
            return;
        }
        const { first_name, last_name, email, gender, sexual_preferences, biography, fame_rating, gps_location, neighborhood, allow_gps, images, } = req.body;
        const dataProfile = {
            user_id: req.user.id,
            firstName: first_name,
            lastName: last_name,
            email,
            gender,
            sexual_preferences,
            biography,
            fame_rating,
            gps_location,
            neighborhood,
            allow_gps,
            images,
        };
        const profile = yield ProfileServices_1.default.updateProfile(dataProfile);
        res.status(200).json({
            status: "success",
            data: {
                message: "Profile updated successfully!",
                images,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            error_message: error.message,
        });
        next(error);
    }
});
exports.default = updateProfile;
