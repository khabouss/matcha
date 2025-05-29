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
class SessionRepository {
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM sessions WHERE accountId = $1';
            const { rows } = yield db_1.default.query(query, [userId]);
            return rows[0];
        });
    }
    static save(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO sessions (accountId, refresh_token, device_info, createdAt, last_active) VALUES($1, $2, $3, $4, $5) RETURNING *';
            const values = [
                session.userId,
                session.refreshToken,
                session.deviceInfo,
                session.createdAt,
                session.last_active,
            ];
            const { rows } = yield db_1.default.query(query, values);
            return rows[0];
        });
    }
    static removeByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM sessions WHERE accountId = $1';
            yield db_1.default.query(query, [userId]);
        });
    }
    static removeByToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM sessions WHERE refresh_token = $1';
            yield db_1.default.query(query, [refreshToken]);
        });
    }
    static findByToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM sessions WHERE refresh_token = $1';
            const { rows } = yield db_1.default.query(query, [refreshToken]);
            return rows[0];
        });
    }
}
exports.default = SessionRepository;
