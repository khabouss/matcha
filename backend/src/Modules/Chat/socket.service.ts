import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../../middleware/auth.middleware';

interface ChatMessage {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
}

interface ConnectedUser {
    userId: string;
    socketId: string;
}

export class SocketService {
    private io: Server;
    private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        this.setupSocketHandlers();
    }

    private setupSocketHandlers() {
        this.io.use(async (socket: Socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error'));
                }

                const decoded = await verifyToken(token);
                socket.data.userId = decoded.id;
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });

        this.io.on('connection', (socket: Socket) => {
            const userId = socket.data.userId;
            this.connectedUsers.set(userId, socket.id);
            console.log(`User connected: ${userId}`);

            // Handle private messages
            socket.on('private_message', async (data: { receiverId: string; content: string }) => {
                const receiverSocketId = this.connectedUsers.get(data.receiverId);
                if (receiverSocketId) {
                    const message: ChatMessage = {
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
            });

            // Handle typing status
            socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
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
    public sendNotification(userId: string, notification: any) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.io.to(socketId).emit('notification', notification);
        }
    }
} 