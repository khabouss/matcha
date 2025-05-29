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
const ProfileServices_1 = __importDefault(require("../../services/ProfileServices"));
const GetProfileUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const profileUserName = req.params.profileUserName;
    console.log("profileId: ", profileUserName);
    console.log("user: ", req.user);
    if (!req.user) {
        res.status(401).json({
            status: "error",
            error_message: "Unauthorized",
        });
        return;
    }
    const viewerId = req.user.id; // get the user id from the token
    try {
        const profile = yield ProfileServices_1.default.getProfileUsers(profileUserName);
        if (!profile) {
            res.status(404).json({
                status: "error",
                error_message: "Profile not found",
            });
            return;
        }
        if (Number(profile.id) !== viewerId) {
            yield ProfileServices_1.default.setViewerProfile(Number(profile.id), viewerId);
        }
        const { user_id, gps_location, allow_gps, password, email } = profile, returndata = __rest(profile, ["user_id", "gps_location", "allow_gps", "password", "email"]);
        const resData = Object.assign({}, returndata);
        // const resData = {
        //   name: "Alice khabouss",
        //   isMatch: true,
        //   lastOnlineStatus: "Two weeks ago",
        //   about: {
        //     gender: "Man",
        //     SP: "Straight",
        //     interest1: "Jogging",
        //     interest2: "Coffee",
        //     intereset3: "Movies",
        //     fame: "fame: 3.12",
        //   },
        //   languages: ["english", "arabic", "russian"],
        //   lastLocation: "Marrakech",
        //   age: 25,
        //   bio: "Love traveling and photography.",
        //   image: [
        //     "https://picsum.photos/400/600?random=1",
        //     "https://picsum.photos/400/600?random=1",
        //     "https://picsum.photos/400/600?random=1",
        //     "https://picsum.photos/400/600?random=1",
        //     "https://picsum.photos/400/600?random=1",
        //   ],
        //   offsetX: 0,
        //   rotate: 0,
        //   opacity: 1,
        // };
        res.status(200).json({
            status: "success",
            data: {
                message: "Profile fetched successfully!",
                profile: resData,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            error_message: error.message,
        });
    }
});
exports.default = GetProfileUsers;
