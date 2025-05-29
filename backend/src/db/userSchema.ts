import { Pool } from "pg";
import pool from ".";

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
    FOREIGN KEY (liked_profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE (liker_user_id, liked_profile_id)
)
`;

export const createUserSchema = async () => {
  const client = await pool.connect();
  try {
    await pool.query(createUserTable);
    await pool.query(createVerificationTokensTable);
    await pool.query(createResetPasswordTokensTable);
    await pool.query(createSessionsTable);
    await pool.query(profileTable);
    await pool.query(profileImagesTable);
    await pool.query(profileViewsTable);
    await pool.query(profileLikesTable);
    console.log("users table created");
  } catch (error) {
    console.log(error);
  }
};

export const dropAndRecreateTables = async () => {
  const client = await pool.connect();
  try {
    // Drop tables in reverse order of dependencies
    await client.query('DROP TABLE IF EXISTS profile_likes CASCADE');
    await client.query('DROP TABLE IF EXISTS profile_views CASCADE');
    await client.query('DROP TABLE IF EXISTS profile_images CASCADE');
    await client.query('DROP TABLE IF EXISTS profiles CASCADE');
    await client.query('DROP TABLE IF EXISTS sessions CASCADE');
    await client.query('DROP TABLE IF EXISTS reset_password_tokens CASCADE');
    await client.query('DROP TABLE IF EXISTS verification_tokens CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    // Recreate tables
    await createUserSchema();
    
    console.log("Tables dropped and recreated successfully");
  } catch (error) {
    console.error("Error dropping and recreating tables:", error);
    throw error;
  } finally {
    client.release();
  }
};
