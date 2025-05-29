import { Pool } from "pg";
import bcrypt from "bcryptjs";
import pool from ".";
import profileRepository from "../Modules/Auth/repositories/profileRepository";

const testUsers = [
  {
    userName: "john_doe",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profile: {
      gender: "male",
      sexual_preferences: "female",
      biography: "Love hiking and photography",
      fame_rating: 4.5,
      gps_location: { lat: 48.8566, lng: 2.3522 }, // Paris coordinates
      neighborhood: "Le Marais",
      allow_gps: true,
      interests: ["hiking", "photography", "travel"]
    }
  },
  {
    userName: "jane_smith",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    profile: {
      gender: "female",
      sexual_preferences: "male",
      biography: "Coffee lover and book enthusiast",
      fame_rating: 4.8,
      gps_location: { lat: 40.7128, lng: -74.0060 }, // New York coordinates
      neighborhood: "Brooklyn",
      allow_gps: true,
      interests: ["reading", "coffee", "art"]
    }
  },
  {
    userName: "alex_wilson",
    password: "password123",
    firstName: "Alex",
    lastName: "Wilson",
    email: "alex.wilson@example.com",
    profile: {
      gender: "male",
      sexual_preferences: "female",
      biography: "Tech geek and fitness enthusiast",
      fame_rating: 4.2,
      gps_location: { lat: 51.5074, lng: -0.1278 }, // London coordinates
      neighborhood: "Shoreditch",
      allow_gps: true,
      interests: ["technology", "fitness", "gaming"]
    }
  },
  {
    userName: "sarah_parker",
    password: "password123",
    firstName: "Sarah",
    lastName: "Parker",
    email: "sarah.parker@example.com",
    profile: {
      gender: "female",
      sexual_preferences: "male",
      biography: "Artist and yoga instructor",
      fame_rating: 4.7,
      gps_location: { lat: 35.6762, lng: 139.6503 }, // Tokyo coordinates
      neighborhood: "Shibuya",
      allow_gps: true,
      interests: ["art", "yoga", "meditation"]
    }
  }
];

export const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM profile_likes');
    await client.query('DELETE FROM profile_views');
    await client.query('DELETE FROM profile_images');
    await client.query('DELETE FROM profiles');
    await client.query('DELETE FROM sessions');
    await client.query('DELETE FROM reset_password_tokens');
    await client.query('DELETE FROM verification_tokens');
    await client.query('DELETE FROM users');

    // Insert users and their profiles
    for (const user of testUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert user
      const userQuery = `
        INSERT INTO users (userName, password, first_name, last_name, email, isVerified)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id
      `;
      const userValues = [user.userName, hashedPassword, user.firstName, user.lastName, user.email];
      const userResult = await client.query(userQuery, userValues);
      const userId = userResult.rows[0].id;

      // Insert profile
      const profileQuery = `
        INSERT INTO profiles (user_id, gender, sexual_preferences, biography, fame_rating, gps_location, neighborhood, allow_gps, interests)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      const profileValues = [
        userId,
        user.profile.gender,
        user.profile.sexual_preferences,
        user.profile.biography,
        user.profile.fame_rating,
        JSON.stringify(user.profile.gps_location),
        user.profile.neighborhood,
        user.profile.allow_gps,
        user.profile.interests
      ];
      await client.query(profileQuery, profileValues);
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 