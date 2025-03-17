import pool from "../../../db";

class profileRepository {
  static async createProfile(profile: any) {
    console.log("profile >>>: ", profile);

    const query = `
            INSERT INTO profiles (user_id, gender, sexual_preferences, biography, fame_rating, gps_location, neighborhood, allow_gps)
            VALUES ($1, $2, $3, $4, $5, POINT($6, $7), $8, $9)
            RETURNING *
        `;
    const values = [
      profile.user_id,
      profile.gender,
      profile.sexual_preferences,
      profile.biography,
      profile.fame_rating || 0.0,
      profile.gps_location?.lat || null,
      profile.gps_location?.lng || null,
      profile.neighborhood || null,
      profile.allow_gps || true,
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
    const query = `
            SELECT * FROM profiles
            JOIN users ON profiles.user_id = users.id
            WHERE users.username = $1
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
                gps_location = POINT($5, $6), neighborhood = $7, allow_gps = $8
            WHERE user_id = $9
            RETURNING *;
        `;
    const profileValues = [
      profile.gender,
      profile.sexual_preferences,
      profile.biography,
      profile.fame_rating || 0.0,
      profile.gps_location?.lat || null,
      profile.gps_location?.lng || null,
      profile.neighborhood || null,
      profile.allow_gps ?? true,
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
  static async getSwipeList(user_id: number, gender: string) {
    // const query = `
    //         SELECT * FROM profiles
    //         WHERE user_id != $1
    //     `;
    //add gender to the query
    const query = `
            SELECT * FROM profiles
            WHERE user_id != $1 AND
            
      `;
    const values = [user_id, gender];
    const row = await pool.query(query, values);
    return row.rows;
  }
}

export default profileRepository;
