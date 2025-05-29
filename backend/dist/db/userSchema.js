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
exports.createUserSchema = void 0;
const _1 = __importDefault(require("."));
const createUserTable = `
    CREATE TABLE IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,
        userName VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isVerified BOOLEAN DEFAULT FALSE
    )
`;
const createVerificationTokensTable = `
    CREATE TABLE IF NOT EXISTS "verification_tokens" (
        id SERIAL PRIMARY KEY,
    accountId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiresAt TIMESTAMP NOT NULL,
    UNIQUE(accountId)
    )
`;
const createResetPasswordTokensTable = `
    CREATE TABLE IF NOT EXISTS "reset_password_tokens" (
        id SERIAL PRIMARY KEY,
    accountId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiresAt TIMESTAMP NOT NULL,
    UNIQUE(accountId)
    )
`;
const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS "sessions" (
        id SERIAL PRIMARY KEY,
    accountId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    device_info TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(accountId)
    )
`;
//     CREATE TABLE IF NOT EXISTS profiles (
//     id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL UNIQUE,
//     gender VARCHAR(10),
//     sexual_preferences VARCHAR(50),
//     biography TEXT,
//     fame_rating DECIMAL(3, 2) DEFAULT 0.00,  -- Fame rating from 0.00 to 100.00
//     gps_location POINT,  -- Stores latitude and longitude
//     neighborhood VARCHAR(100),
//     allow_gps BOOLEAN DEFAULT TRUE,  -- Flag if user allows GPS tracking,
//     profile_images TEXT[5] DEFAULT ARRAY[]::TEXT[],  -- Array of profile image URLs
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )
const profileTable = `
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    gender VARCHAR(10),
    sexual_preferences VARCHAR(50),
    biography TEXT,
    fame_rating DECIMAL(3, 2) DEFAULT 0.00,  -- Fame rating from 0.00 to 100.00
    gps_location JSONB,  -- Stores latitude and longitude
    neighborhood VARCHAR(100),
    interests TEXT[],  -- Array of user interests
    allow_gps BOOLEAN DEFAULT TRUE,  -- Flag if user allows GPS tracking
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;
// CREATE TABLE IF NOT EXISTS profile_images (
//     id SERIAL PRIMARY KEY,
//     profile_id INT NOT NULL,
//     image_url TEXT NOT NULL,
//     FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
// )
const profileImagesTable = `
CREATE TABLE IF NOT EXISTS profile_images (
    id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

`;
const profileViewsTable = `
CREATE TABLE IF NOT EXISTS profile_views (
    id SERIAL PRIMARY KEY,
    viewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The user who viewed the profile
    profile_id INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- The profile that was viewed
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (viewer_id, profile_id)
)
`;
const profileLikesTable = `
CREATE TABLE IF NOT EXISTS profile_likes (
    id SERIAL PRIMARY KEY,
    liker_user_id INT NOT NULL,
    liked_profile_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (liker_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (liked_profile_id) REFERENCES profiles(id) ON DELETE CASCADE
)
`;
const createUserSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield _1.default.connect();
    try {
        yield _1.default.query(createUserTable);
        yield _1.default.query(createVerificationTokensTable);
        yield _1.default.query(createResetPasswordTokensTable);
        yield _1.default.query(createSessionsTable);
        yield _1.default.query(profileTable);
        yield _1.default.query(profileImagesTable);
        yield _1.default.query(profileViewsTable);
        yield _1.default.query(profileLikesTable);
        console.log("users table created");
    }
    catch (error) {
        console.log(error);
    }
});
exports.createUserSchema = createUserSchema;
