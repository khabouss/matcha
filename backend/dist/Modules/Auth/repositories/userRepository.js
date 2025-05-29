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
exports.UserRepository = void 0;
const db_1 = __importDefault(require("../../../db"));
class UserRepository {
    static createUser(userName, password, firstName, lastName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "INSERT INTO users(userName, password, first_name, last_name, email) VALUES($1, $2, $3, $4, $5) RETURNING *";
            const values = [userName, password, firstName, lastName, email];
            const { rows } = yield db_1.default.query(query, values);
            return rows[0];
        });
    }
    static UpdateUser(id, firstName, lastName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            UPDATE users
            SET first_name = $1, last_name = $2, email = $3
            WHERE id = $4
            RETURNING *
        `;
            const values = [firstName, lastName, email, id];
            const { rows } = yield db_1.default.query(query, values);
            return rows[0];
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM users WHERE id = $1";
            const { rows } = yield db_1.default.query(query, [id]);
            return rows[0];
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM users WHERE email = $1";
            const { rows } = yield db_1.default.query(query, [email]);
            return rows[0] || null;
        });
    }
    static findByUserName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM users WHERE userName = $1";
            const { rows } = yield db_1.default.query(query, [userName]);
            return rows[0];
        });
    }
    static putVerificationToken(token, accountId, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            // INSERT INTO verification_tokens (accountId, token, expiresAt)
            //     VALUES ($1, $2, $3)
            //     RETURNING *;
            const query = "INSERT INTO verification_tokens (accountId, token, expiresAt) VALUES ($1, $2, $3) RETURNING *;";
            // "INSERT INTO verification_tokens(accountId, token, expiresAt) VALUES((SELECT id FROM users WHERE email = $2), $1, NOW() + INTERVAL '1 day') ON CONFLICT (accountId) DO UPDATE SET token = $1, expiresAt = NOW() + INTERVAL '1 day'";
            const values = [accountId, token, expiresAt];
            yield db_1.default.query(query, values);
        });
    }
    static putResetPasswordToken(token, accountId, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "INSERT INTO reset_password_tokens (accountId, token, expiresAt) VALUES ($1, $2, $3) RETURNING *;";
            const values = [accountId, token, expiresAt];
            yield db_1.default.query(query, values);
        });
    }
    static verifyAccount(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT * FROM verification_tokens WHERE token = $1`;
            const { rows } = yield db_1.default.query(query, [token]);
            return rows[0];
        });
    }
    static updateVerificationStatus(accountId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "UPDATE users SET isVerified = $1 WHERE id = $2";
            yield db_1.default.query(query, [status, accountId]);
        });
    }
    static deleteVerificationToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "DELETE FROM verification_tokens WHERE token = $1";
            yield db_1.default.query(query, [token]);
        });
    }
    static updatePassword(password, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "UPDATE users SET password = $1 WHERE id = $2";
            yield db_1.default.query(query, [password, id]);
        });
    }
}
exports.UserRepository = UserRepository;
