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
const swipeList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                status: "error",
                error_message: "Unauthorized",
            });
            return;
        }
        const { latitude, longitude } = req.query;
        console.log("============================");
        console.log("latitude", latitude);
        console.log("longitude", longitude);
        const swipeData = yield ProfileServices_1.default.getSwipeList(req.user.id, {
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
        });
        res.status(200).json({
            status: "success",
            data: {
                swipeData,
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
exports.default = swipeList;
