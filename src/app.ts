import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db';
import applyRateLimit from './middlewares/rateLimit';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware';
import redisClient from './services/redisService';
import { connectToRabbitMQ } from './services/rabbitmqService';
import swaggerSetup from './config/swagger';
import 'colors';

// Load env vars
dotenv.config();

async function connect() {
// Connect to database
connectDB();
// RabbitMQ connection
// await connectToRabbitMQ();
// Connect to redis
await redisClient.connect();
}

connect();

// Route files
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(applyRateLimit);
app.use(cookieParser());


// Setup Swagger documentation
swaggerSetup(app);


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any, promise: Promise<any>) => {
  console.error(`Error: ${err.message}`.red);
  // Exit the process with failure
  process.exit(1);
});

export default app;
