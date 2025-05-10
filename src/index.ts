import dotenv from 'dotenv';
import { setupApp } from './config/app';
import { connectDB } from './config/database';
import { logger } from './utils/logger';

// Загрузка переменных окружения
const result = dotenv.config();
if (result.error) {
  logger.warn(`Не удалось загрузить файл .env: ${result.error.message}`);
  logger.info('Продолжение работы с переменными среды системы...');
} else {
  logger.info('Переменные окружения загружены из .env файла');
}

// Проверка обязательных переменных окружения
const requiredEnvVars = ['NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.warn(
    `Отсутствуют следующие переменные окружения: ${missingEnvVars.join(', ')}`
  );
  logger.info('Будут использованы значения по умолчанию');
}

// Определение порта
const PORT = process.env.PORT || 5000;

// Создание приложения
const app = setupApp();

// Запуск сервера
const startServer = async () => {
  try {
    // Подключение к MongoDB
    await connectDB();

    // Запуск HTTP сервера
    app.listen(PORT, () => {
      logger.info(
        `Server running in ${
          process.env.NODE_ENV || 'development'
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Обработка необработанных исключений
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Запуск сервера
startServer();
