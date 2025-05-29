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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const auth_middleware_1 = require("../../middleware/auth.middleware");
class SocketService {
    constructor(server) {
        this.connectedUsers = new Map(); // userId -> socketId
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        this.setupSocketHandlers();
    }
    setupSocketHandlers() {
        this.io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error'));
                }
                const decoded = yield (0, auth_middleware_1.verifyToken)(token);
                socket.data.userId = decoded.id;
                next();
            }
            catch (error) {
                next(new Error('Authentication error'));
            }
        }));
        this.io.on('connection', (socket) => {
            const userId = socket.data.userId;
            this.connectedUsers.set(userId, socket.id);
            console.log(`User connected: ${userId}`);
            // Handle private messages
            socket.on('private_message', (data) => __awaiter(this, void 0, void 0, function* () {
                const receiverSocketId = this.connectedUsers.get(data.receiverId);
                if (receiverSocketId) {
                    const message = {
                        senderId: userId,
                        receiverId: data.receiverId,
                        content: data.content,
                        timestamp: new Date()
                    };
                    // Emit to receiver
                    this.io.to(receiverSocketId).emit('private_message', message);
                    // Emit back to sender for confirmation
                    socket.emit('private_message', message);
                }
            }));
            // Handle typing status
            socket.on('typing', (data) => {
                const receiverSocketId = this.connectedUsers.get(data.receiverId);
                if (receiverSocketId) {
                    this.io.to(receiverSocketId).emit('typing', {
                        userId,
                        isTyping: data.isTyping
                    });
                }
            });
            // Handle online status
            socket.on('disconnect', () => {
                this.connectedUsers.delete(userId);
                this.io.emit('user_status', {
                    userId,
                    status: 'offline'
                });
            });
        });
    }
    // Method to send notification to specific user
    sendNotification(userId, notification) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.io.to(socketId).emit('notification', notification);
        }
    }
}
exports.SocketService = SocketService;
