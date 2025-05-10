import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from '../routes';
import { logger } from '../utils/logger';
import { errorHandler } from '../middleware/error.middleware';

/**
 * Настройка Express приложения
 */
export const setupApp = (): Application => {
  const app: Application = express();

  // Базовые middleware
  app.use(helmet()); // Безопасность
  app.use(cors()); // CORS
  app.use(express.json({ limit: '5mb' })); // Парсинг JSON
  app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded данных

  // Логирование HTTP запросов
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => {
          logger.info(message.trim());
        },
      },
    })
  );

  // Все API-роуты под /api
  app.use('/api', apiRoutes);

  // Обработка статических файлов (если необходимо)
  app.use(express.static(path.join(__dirname, '../../public')));

  // Обработка 404
  app.use((_: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'The requested resource does not exist',
    });
  });

  // Глобальный обработчик ошибок
  app.use(errorHandler);

  return app;
};
