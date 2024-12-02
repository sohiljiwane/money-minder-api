import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error';
import { limiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/logger';
import { login } from './controllers/auth.controller';

const app = express();

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Performance middleware
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging and rate limiting
app.use(requestLogger);
app.use(limiter);

// Secure static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  dotfiles: 'deny',
  index: false
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Login endpoint
app.post('/api/auth/login', login);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Performing graceful shutdown...');
  // Add cleanup logic here (close database connections, etc.)
  process.exit(0);
});

export default app;