import pool from "../../../db";
type User = {
  id: number;
  userName: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  created_At: Date; // Add created_At if you want to use it
  isverified: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
  verificationToken?: string;
};
export class UserRepository {
  static async createUser(
    userName: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string
  ): Promise<User> {
    const query =
      "INSERT INTO users(userName, password, first_name, last_name, email) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [userName, password, firstName, lastName, email];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id: number): Promise<User> {
    const query = "SELECT * FROM users WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
  static async findByEmail(email: string): Promise<User> {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  }
  static async findByUserName(userName: string): Promise<User> {
    const query = "SELECT * FROM users WHERE userName = $1";
    const { rows } = await pool.query(query, [userName]);
    return rows[0];
  }
  static async putVerificationToken(
    token: string,
    accountId: number,
    expiresAt: Date
  ): Promise<void> {
    // INSERT INTO verification_tokens (accountId, token, expiresAt)
    //     VALUES ($1, $2, $3)
    //     RETURNING *;
    const query =
      "INSERT INTO verification_tokens (accountId, token, expiresAt) VALUES ($1, $2, $3) RETURNING *;";
    // "INSERT INTO verification_tokens(accountId, token, expiresAt) VALUES((SELECT id FROM users WHERE email = $2), $1, NOW() + INTERVAL '1 day') ON CONFLICT (accountId) DO UPDATE SET token = $1, expiresAt = NOW() + INTERVAL '1 day'";
    const values = [accountId, token, expiresAt];
    await pool.query(query, values);
  }
  static async putResetPasswordToken(
    token: string,
    accountId: number,
    expiresAt: Date
  ): Promise<void> {
    const query =
      "INSERT INTO reset_password_tokens (accountId, token, expiresAt) VALUES ($1, $2, $3) RETURNING *;";
    const values = [accountId, token, expiresAt];
    await pool.query(query, values);
  }

  static async verifyAccount(token: string) {
    const query = `
            SELECT * FROM verification_tokens WHERE token = $1`;
    const { rows } = await pool.query(query, [token]);
    return rows[0];
  }
  static async updateVerificationStatus(
    accountId: number,
    status: boolean
  ): Promise<void> {
    const query = "UPDATE users SET isVerified = $1 WHERE id = $2";
    await pool.query(query, [status, accountId]);
  }
  static async deleteVerificationToken(token: string): Promise<void> {
    const query = "DELETE FROM verification_tokens WHERE token = $1";
    await pool.query(query, [token]);
  }

  static async updatePassword(password: string, id: number) {
    const query = "UPDATE users SET password = $1 WHERE id = $2";
    await pool.query(query, [password, id]);
  }
}
