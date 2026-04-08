import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import communityRoutes from './routes/communityRoutes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'community-service', timestamp: new Date().toISOString() });
});

app.use('/', communityRoutes);

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
    
    // Drop existing text indexes to avoid language override issues
    const db = mongoose.connection.db;
    if (db) {
      try {
        await db.collection('posts').dropIndexes();
        console.log('Dropped existing indexes on posts collection');
      } catch (e) {
        // Ignore error if indexes don't exist
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Community Service running on port ${PORT}`);
  });
};

startServer();

export default app;
