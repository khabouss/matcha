import { Client } from "pg";
import dotenv from "dotenv";
import pool from ".";

dotenv.config();

async function seedDatabase() {
  try {
    const usersData = [
      {
        userName: "alice_wonder",
        password: "hashed_password1",
        first_name: "Alice",
        last_name: "Wonder",
        email: "alice@example.com",
        isVerified: true,
      },
      {
        userName: "bob_builder",
        password: "hashed_password2",
        first_name: "Bob",
        last_name: "Builder",
        email: "bob@example.com",
        isVerified: false,
      },
      {
        userName: "charlie_brown",
        password: "hashed_password3",
        first_name: "Charlie",
        last_name: "Brown",
        email: "charlie@example.com",
        isVerified: true,
      },
    ];

    const userIds: number[] = [];
    for (const user of usersData) {
      const res = await pool.query(
        `INSERT INTO users (userName, password, first_name, last_name, email, isVerified)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          user.userName,
          user.password,
          user.first_name,
          user.last_name,
          user.email,
          user.isVerified,
        ]
      );
      userIds.push(res.rows[0].id);
    }

    console.log("Inserted Users:", userIds);

    const profilesData = [
      {
        user_id: userIds[0],
        gender: "Male",
        sexual_preferences: "Heterosexual",
        biography: "I love coding.",
        fame_rating: 9.99,
        gps_location: { lat: 40.7128, lng: -74.006 },
        neighborhood: "NYC",
        allow_gps: true,
      },
      {
        user_id: userIds[1],
        gender: "Female",
        sexual_preferences: "Bisexual",
        biography: "Travel enthusiast.",
        fame_rating: 8.5,
        gps_location: { lat: 34.0522, lng: -118.2437 },
        neighborhood: "LA",
        allow_gps: false,
      },
      {
        user_id: userIds[2],
        gender: "Male",
        sexual_preferences: "Gay",
        biography: "Photographer and artist.",
        fame_rating: 5.25,
        gps_location: { lat: 51.5074, lng: -0.1278 },
        neighborhood: "London",
        allow_gps: true,
      },
    ];

    const profileIds: number[] = [];
    for (const profile of profilesData) {
      const res = await pool.query(
        `INSERT INTO profiles (user_id, gender, sexual_preferences, biography, fame_rating, gps_location, neighborhood, allow_gps)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          profile.user_id,
          profile.gender,
          profile.sexual_preferences,
          profile.biography,
          profile.fame_rating,
          JSON.stringify({
            lat: profile.gps_location.lat,
            lng: profile.gps_location.lng,
          }), // Converting to JSONB
          profile.neighborhood,
          profile.allow_gps,
        ]
      );
      profileIds.push(res.rows[0].id);
    }

    console.log("Inserted Profiles:", profileIds);

    const profileImagesData = [
      {
        profile_id: profileIds[0],
        images: [
          "https://www.pressrelease.com/files/66/45/98bf6f3af6bea4f54cb9635476ff.png",
          "https://www.pressrelease.com/files/66/45/98bf6f3af6bea4f54cb9635476ff.png",
        ],
      },
      {
        profile_id: profileIds[1],
        images: [
          "https://images.bonnier.cloud/files/wom/production/2023/10/18045212/woman-dk-mand-med-telefon-3Xh5xYka_RBQSFUWvh2bMg.jpg",
          "https://images.bonnier.cloud/files/wom/production/2023/10/18045212/woman-dk-mand-med-telefon-3Xh5xYka_RBQSFUWvh2bMg.jpg",
        ],
      },
      {
        profile_id: profileIds[2],
        images: [
          "https://img.freepik.com/free-photo/beautiful-smiling-girl-using-mobile-phone-looking-smartphone-pleased_1258-19053.jpg",
          "https://img.freepik.com/free-photo/beautiful-smiling-girl-using-mobile-phone-looking-smartphone-pleased_1258-19053.jpg",
        ],
      },
    ];

    for (const profileImage of profileImagesData) {
      for (const img of profileImage.images) {
        await pool.query(
          `INSERT INTO profile_images (profile_id, image_url) VALUES ($1, $2)`,
          [profileImage.profile_id, img]
        );
      }
    }

    console.log("Inserted Profile Images");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await pool.end();
  }
}

export default seedDatabase;
