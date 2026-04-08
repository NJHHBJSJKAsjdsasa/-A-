import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import messageRoutes from './routes/messageRoutes';
import { Message } from './models/Message';
import { Conversation } from './models/Conversation';

const app = express();
const PORT = process.env.PORT || 3003;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'message-service', timestamp: new Date().toISOString() });
});

app.use('/', messageRoutes);

interface SocketUser {
  userId: string;
  socketId: string;
}

const connectedUsers = new Map<string, string>();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-jwt-secret-key';
    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  connectedUsers.set(userId, socket.id);
  
  console.log(`User ${userId} connected with socket ${socket.id}`);

  socket.on('join_conversation', async (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User ${userId} joined conversation ${conversationId}`);
  });

  socket.on('leave_conversation', (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`User ${userId} left conversation ${conversationId}`);
  });

  socket.on('send_message', async (data: { conversationId: string; type: string; content: string }) => {
    try {
      const { conversationId, type = 'text', content } = data;

      const message = new Message({
        conversationId,
        senderId: userId,
        type,
        content,
        readBy: [userId]
      });

      await message.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: {
          content: type === 'text' ? content : `[${type}]`,
          senderId: userId,
          createdAt: new Date()
        }
      });

      io.to(conversationId).emit('receive_message', {
        _id: message._id,
        conversationId,
        senderId: userId,
        type,
        content,
        createdAt: message.createdAt
      });
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
    socket.to(data.conversationId).emit('user_typing', {
      userId,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    console.log(`User ${userId} disconnected`);
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
  });
});

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/doraemon';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  
  httpServer.listen(PORT, () => {
    console.log(`Message Service running on port ${PORT}`);
  });
};

startServer();

export { io, connectedUsers };
