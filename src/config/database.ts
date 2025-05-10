import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Выбор URI подключения в зависимости от окружения
 */
const getMongoURI = (): string => {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    // В продакшн используем прямой URI
    return (
      process.env.MONGO_URI_PROD ||
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/screen-config'
    );
  } else {
    // В dev через Docker или локально
    return (
      process.env.MONGO_URI_DEV ||
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/screen-config'
    );
  }
};

// Опции подключения к MongoDB
const connectOptions: mongoose.ConnectOptions = {
  // Автоматическое переподключение при потере соединения
  serverSelectionTimeoutMS: 5000, // Таймаут выбора сервера
  socketTimeoutMS: 45000, // Как долго сокет может быть неактивным
  connectTimeoutMS: 10000, // Таймаут подключения
  retryWrites: true, // Повторные попытки операций записи
  minPoolSize: 5, // Минимальный размер пула соединений
  maxPoolSize: 10, // Максимальный размер пула соединений
};

/**
 * Подключение к базе данных MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = getMongoURI();
    logger.info(
      `Connecting to MongoDB with URI: ${mongoURI.replace(
        /\/\/([^:]+):[^@]+@/,
        '//***:***@'
      )}`
    );
    await mongoose.connect(mongoURI, connectOptions);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Отключение от базы данных MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
  }
};

// Обработка событий Mongoose
mongoose.connection.on('error', (err: Error) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.info('MongoDB disconnected');
});

// Корректное отключение при завершении работы приложения
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
