import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { json } from 'express';
import { authRouter } from './routes/auth';
import { cronJobsRouter } from './routes/cronJobs';
import { webhooksRouter } from './routes/webhooks';
import { errorHandler } from './middleware/error';
import { cronManager } from './lib/cronManager';
import { logger } from './lib/logger';

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/cron-manager')
  .then(() => {
    logger.info('Connected to MongoDB');
    cronManager.initialize();
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
  });

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/cron-jobs', cronJobsRouter);
app.use('/api/webhooks', webhooksRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});