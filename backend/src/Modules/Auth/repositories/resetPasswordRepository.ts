import pool from '../../../db';

class ResetPasswordRepository {
    static async findByToken(token: string) {
        const query = 'SELECT * FROM reset_password_tokens WHERE token = $1';
        const { rows } = await pool.query(query, [token]);
        return rows[0];
    }
    static async deleteToken(token: string) {
        const query = 'DELETE FROM reset_password_tokens WHERE token = $1';
        await pool.query(query, [token]);
    }
    static async findByUserId(userId: number) {
        const query =
            'SELECT * FROM reset_password_tokens WHERE accountId = $1';
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    }
}

export default ResetPasswordRepository;
