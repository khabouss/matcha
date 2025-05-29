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
const db_1 = __importDefault(require("../../../db"));
class profileRepository {
    static createProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const row = yield db_1.default.query(query, values);
            return row.rows[0];
        });
    }
    static findProfileByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const row = yield db_1.default.query(query, values);
            return row.rows[0];
        });
    }
    static findProfileById(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT * FROM profiles
            WHERE id = $1
        `;
            const values = [profile_id];
            const row = yield db_1.default.query(query, values);
            return row.rows[0];
        });
    }
    static setViewerProfile(profile_id, viewer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO profile_views (viewer_id, profile_id)
            VALUES ($1, $2)
            ON CONFLICT (viewer_id, profile_id) DO NOTHING -- Prevent duplicate views
        `;
            const values = [viewer_id, profile_id];
            const row = yield db_1.default.query(query, values);
            return row.rows[0];
        });
    }
    static verfiyProfileOwner(profile_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT * FROM profiles
            WHERE id = $1 AND user_id = $2
        `;
            const values = [profile_id, user_id];
            const row = yield db_1.default.query(query, values);
            return row.rows[0];
        });
    }
    static getProfileViews(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const row = yield db_1.default.query(query, values);
            return row.rows;
        });
    }
    static findProfileByUserNume(user_name) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const row = yield db_1.default.query(query, values);
            return row.rows[0];
        });
    }
    static putProfileImages(profile_id, image_urls) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO profile_images (profile_id, image_url)
        VALUES ($1, $2)
        RETURNING *
        `;
            const values = [profile_id, image_urls];
            const row = yield db_1.default.query(query, values);
        });
    }
    static getProfileImages(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT * FROM profile_images
            WHERE profile_id = $1
        `;
            const values = [profile_id];
            const row = yield db_1.default.query(query, values);
            return row.rows;
        });
    }
    static updateProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
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
                ((_a = profile.gps_location) === null || _a === void 0 ? void 0 : _a.lat) || null,
                ((_b = profile.gps_location) === null || _b === void 0 ? void 0 : _b.lng) || null,
                profile.neighborhood || null,
                (_c = profile.allow_gps) !== null && _c !== void 0 ? _c : true,
                profile.user_id,
            ];
            const profileRow = yield db_1.default.query(profileQuery, profileValues);
            return profileRow.rows[0];
        });
    }
    static deleteProfileImages(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            DELETE FROM profile_images
            WHERE profile_id = $1
        `;
            const values = [profile_id];
            const row = yield db_1.default.query(query, values);
            return row.rows;
        });
    }
    static getSwipeList(user_id, gender, location) {
        return __awaiter(this, void 0, void 0, function* () {
            //add gender to the query
            // const query = `
            //         SELECT * FROM profiles
            //         WHERE user_id != $1 AND gender != $2
            var _a;
            //   `;
            // const values = [user_id, gender];
            // const row = await pool.query(query, values);
            // return row.rows;
            let query = `SELECT * FROM profiles WHERE user_id != $1 AND gender != $2`;
            const params = [user_id, gender];
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
            const row = yield db_1.default.query(query, params);
            return (_a = row.rows) !== null && _a !== void 0 ? _a : [];
        });
    }
}
exports.default = profileRepository;
