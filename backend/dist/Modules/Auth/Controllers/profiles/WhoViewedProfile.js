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
const whoViewedProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const profileId = req.params.profileId;
    if (!req.user) {
        res.status(401).json({
            status: "error",
            error_message: "Unauthorized",
        });
        return;
    }
    const userId = req.user.id; // The logged-in user
    try {
        const verfiyProfileOwner = yield ProfileServices_1.default.verfiyProfileOwner(Number(profileId), userId);
        const viewsArray = Object.values(verfiyProfileOwner);
        if (!req.user) {
            res.status(401).json({
                status: "error",
                error_message: "Unauthorized",
            });
            return;
        }
        res.status(200).json({
            status: "success",
            data: {
                message: "Profile fetched successfully!",
                data: viewsArray,
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
exports.default = whoViewedProfile;
