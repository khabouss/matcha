import pool from '../../../db';
class SessionRepository {
    static async findByUserId(userId: number) {
        const query = 'SELECT * FROM sessions WHERE accountId = $1';
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    }
    static async save(session: {
        userId: number;
        refreshToken: string;
        deviceInfo: string;
        createdAt: Date;
        last_active: Date;
    }) {
        const query =
            'INSERT INTO sessions (accountId, refresh_token, device_info, createdAt, last_active) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [
            session.userId,
            session.refreshToken,
            session.deviceInfo,
            session.createdAt,
            session.last_active,
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
    static async removeByUserId(userId: number) {
        const query = 'DELETE FROM sessions WHERE accountId = $1';
        await pool.query(query, [userId]);
    }
    static async removeByToken(refreshToken: string) {
        const query = 'DELETE FROM sessions WHERE refresh_token = $1';
        await pool.query(query, [refreshToken]);
    }
    static async findByToken(refreshToken: string) {
        const query = 'SELECT * FROM sessions WHERE refresh_token = $1';
        const { rows } = await pool.query(query, [refreshToken]);
        return rows[0];
    }
}

export default SessionRepository;
