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
exports.createSchemas = void 0;
// db.ts
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const userSchema_1 = require("./userSchema");
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Central function to create all schemas
const createSchemas = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating schemas...");
    yield (0, userSchema_1.createUserSchema)();
});
exports.createSchemas = createSchemas;
exports.default = pool;
