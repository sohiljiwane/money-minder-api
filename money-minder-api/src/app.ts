import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error';
import { limiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(limiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;