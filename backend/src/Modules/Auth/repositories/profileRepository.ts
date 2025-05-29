import pool from "../../../db";

class profileRepository {
  static async createProfile(profile: any) {
    console.log("profile >>>: ", profile);

    // const query = `
    //         INSERT INTO profiles (user_id, gender, sexual_preferences, biography, fame_rating, gps_location, neighborhood, allow_gps)
    //         VALUES ($1, $2, $3, $4, $5, POINT($6, $7), $8, $9)
    //         RETURNING *
    //     `;
    const query = `
    INSERT INTO profiles (user_id, gender, sexual_preferences, biography, fame_rating, gps_location, neighborhood, allow_gps,interests)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
    const values = [
      profile.user_id,
      profile.gender,
      profile.sexual_preferences,
      profile.biography,
      profile.fame_rating || 0.0,
      profile.gps_location ? JSON.stringify(profile.gps_location) : null,
      profile.neighborhood || null,
      profile.allow_gps || true,
      Array.isArray(profile.interests) ? profile.interests : [],
    ];
    const row = await pool.query(query, values);
    return row.rows[0];
  }
  static async findProfileByUserId(user_id: number) {
    const query = `
            SELECT * FROM profiles
            WHERE user_id = $1
        `;
    //     const query = `
    //     SELECT p.*, i.*
    //     FROM profiles p
    //     LEFT JOIN profile_images i ON p.id = i.profile_id
    //     WHERE p.user_id = $1
    // `;
    const values = [user_id];
    const row = await pool.query(query, values);
    return row.rows[0];
  }
  static async findProfileById(profile_id: number) {
    const query = `
            SELECT * FROM profiles
            WHERE id = $1
        `;
    const values = [profile_id];
    const row = await pool.query(query, values);
    return row.rows[0];
  }
  static async setViewerProfile(profile_id: number, viewer_id: number) {
    const query = `
            INSERT INTO profile_views (viewer_id, profile_id)
            VALUES ($1, $2)
            ON CONFLICT (viewer_id, profile_id) DO NOTHING -- Prevent duplicate views
        `;
    const values = [viewer_id, profile_id];
    const row = await pool.query(query, values);
    return row.rows[0];
  }
  static async verfiyProfileOwner(profile_id: number, user_id: number) {
    const query = `
            SELECT * FROM profiles
            WHERE id = $1 AND user_id = $2
        `;
    const values = [profile_id, user_id];
    const row = await pool.query(query, values);
    return row.rows[0];
  }
  static async getProfileViews(profile_id: number) {
    // const query = `
    //     SELECT COUNT(*) FROM profile_views
    //     WHERE profile_id = $1 JOIN users ON profile_views.viewer_id = users.id
    //     ORDER BY profile_views.viewed_at DESC
    // `;
    const query = `
    SELECT users.id, users.username, profile_views.viewed_at 
    FROM profile_views
    JOIN users ON profile_views.viewer_id = users.id
    WHERE profile_views.profile_id = $1
    ORDER BY profile_views.viewed_at DESC
`;
    const values = [profile_id];
    const row = await pool.query(query, values);
    return row.rows;
  }

  static async findProfileByUserNume(user_name: string) {
    // const query = `
    //         SELECT * FROM profiles
    //         JOIN users ON profiles.user_id = users.id
    //         WHERE users.username = $1
    //     `;
    const query = `
            SELECT * FROM profiles
            WHERE user_id = $1
        `;
    const values = [user_name];
    const row = await pool.query(query, values);
    return row.rows[0];
  }
  static async putProfileImages(profile_id: number, image_urls: string) {
    const query = `
        INSERT INTO profile_images (profile_id, image_url)
        VALUES ($1, $2)
        RETURNING *
        `;
    const values = [profile_id, image_urls];
    const row = await pool.query(query, values);
  }
  static async getProfileImages(profile_id: number) {
    const query = `
            SELECT * FROM profile_images
            WHERE profile_id = $1
        `;
    const values = [profile_id];
    const row = await pool.query(query, values);
    return row.rows;
  }
  static async updateProfile(profile: any) {
    const profileQuery = `
            UPDATE profiles
            SET gender = $1, sexual_preferences = $2, biography = $3, fame_rating = $4, 
                gps_location = $5, neighborhood = $6, allow_gps = $7, interests = $8
            WHERE user_id = $9
            RETURNING *;
        `;
    const profileValues = [
      profile.gender,
      profile.sexual_preferences,
      profile.biography,
      profile.fame_rating || 0.0,
      profile.gps_location ? JSON.stringify(profile.gps_location) : null,
      profile.neighborhood || null,
      profile.allow_gps ?? true,
      Array.isArray(profile.interests) ? profile.interests : [],
      profile.user_id,
    ];
    const profileRow = await pool.query(profileQuery, profileValues);
    return profileRow.rows[0];
  }
  static async deleteProfileImages(profile_id: number) {
    const query = `
            DELETE FROM profile_images
            WHERE profile_id = $1
        `;
    const values = [profile_id];
    const row = await pool.query(query, values);
    return row.rows;
  }
  static async getSwipeList(
    user_id: number,
    gender: string,
    location?: { latitude?: number; longitude?: number }
  ) {
    let query = `
      SELECT p.* 
      FROM profiles p
      WHERE p.user_id != $1 
      AND p.gender != $2
      AND NOT EXISTS (
        SELECT 1 
        FROM profile_likes pl 
        WHERE (pl.liker_user_id = $1 AND pl.liked_profile_id = p.id)
           OR (pl.liker_user_id = p.user_id AND pl.liked_profile_id = $1)
      )
    `;
    const params: any[] = [user_id, gender];

    // if (location?.latitude !== undefined && location?.longitude !== undefined) {
    //   query += ` AND ST_DistanceSphere(
    //     ST_SetSRID(ST_MakePoint(
    //       gps_location->>'lng'::double precision,  -- Correctly cast longitude from JSONB to double precision
    //       gps_location->>'lat'::double precision    -- Correctly cast latitude from JSONB to double precision
    //     ), 4326),
    //     ST_SetSRID(ST_MakePoint($3::double precision, $4::double precision), 4326)
    //   ) < 50000`;

    //   params.push(location.longitude, location.latitude);
    // }
    const row = await pool.query(query, params);
    return row.rows ?? [];
  }

  static async likeProfile(likerUserId: number, likedProfileId: number) {
    const query = `
      INSERT INTO profile_likes (liker_user_id, liked_profile_id)
      VALUES ($1, $2)
      ON CONFLICT (liker_user_id, liked_profile_id) DO NOTHING
      RETURNING *;
    `;
    const values = [likerUserId, likedProfileId];
    const row = await pool.query(query, values);
    return row.rows[0];
  }

  static async checkMatch(likerUserId: number, likedProfileId: number) {
    const query = `
      SELECT EXISTS (
        SELECT 1 FROM profile_likes
        WHERE liker_user_id = $2 AND liked_profile_id = $1
      ) as is_match;
    `;
    const values = [likerUserId, likedProfileId];
    const row = await pool.query(query, values);
    return row.rows[0]?.is_match || false;
  }

  static async getMatches(userId: number) {
    const query = `
      SELECT DISTINCT 
        p.id as profile_id,
        p.user_id,
        u.userName,
        u.first_name,
        u.last_name,
        u.email,
        p.gender,
        p.sexual_preferences,
        p.biography,
        p.fame_rating,
        p.neighborhood,
        p.interests
      FROM profile_likes pl1
      JOIN profile_likes pl2 ON pl1.liker_user_id = pl2.liked_profile_id 
        AND pl1.liked_profile_id = pl2.liker_user_id
      JOIN profiles p ON p.id = pl2.liker_user_id
      JOIN users u ON u.id = p.user_id
      WHERE pl1.liker_user_id = $1;
    `;
    const values = [userId];
    const row = await pool.query(query, values);
    return row.rows;
  }

  static async getLikedProfiles(userId: number) {
    const query = `
      SELECT p.*, u.userName, u.first_name, u.last_name, u.email
      FROM profile_likes pl
      JOIN profiles p ON p.id = pl.liked_profile_id
      JOIN users u ON u.id = p.user_id
      WHERE pl.liker_user_id = $1;
    `;
    const values = [userId];
    const row = await pool.query(query, values);
    return row.rows;
  }

  static async unmatchProfile(userId: number, unmatchedProfileId: number) {
    const unmatchQuery = `
      DELETE FROM profile_likes
      WHERE (liker_user_id = $1 AND liked_profile_id = $2)
         OR (liker_user_id = $2 AND liked_profile_id = $1);
    `;
    await pool.query(unmatchQuery, [userId, unmatchedProfileId]);
  }
}

export default profileRepository;
