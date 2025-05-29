"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const CreateProfile_1 = __importDefault(require("../Controllers/profiles/CreateProfile"));
const Me_1 = __importDefault(require("../Controllers/profiles/Me"));
const GetProfile_1 = __importDefault(require("../Controllers/profiles/GetProfile"));
const WhoViewedProfile_1 = __importDefault(require("../Controllers/profiles/WhoViewedProfile"));
const SwipeList_1 = __importDefault(require("../Controllers/profiles/SwipeList"));
const MyProfileDetails_1 = __importDefault(require("../Controllers/profiles/MyProfileDetails"));
const UpdateProfile_1 = __importDefault(require("../Controllers/profiles/UpdateProfile"));
const attachProfileRoute = (router) => {
    router.post("/", authMiddleware_1.authMiddleware, CreateProfile_1.default);
    router.get("/me", authMiddleware_1.authMiddleware, Me_1.default);
    router.patch("/me", authMiddleware_1.authMiddleware, UpdateProfile_1.default);
    router.get("/swipe-list", authMiddleware_1.authMiddleware, SwipeList_1.default);
    router.get("/me/viewers", authMiddleware_1.authMiddleware, WhoViewedProfile_1.default);
    router.get("/:profileUserName", authMiddleware_1.authMiddleware, GetProfile_1.default);
    router.get("/me/details", authMiddleware_1.authMiddleware, MyProfileDetails_1.default);
};
exports.default = attachProfileRoute;
