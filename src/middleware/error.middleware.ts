import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware для обработки ошибок
 */
export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  // Логируем ошибку
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Отправляем ответ с ошибкой
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Интерфейс для ошибок валидации
 */
interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      [key: string]: any;
    };
  };
}

/**
 * Middleware для обработки ошибок валидации запросов
 */
export const validationErrorHandler = (
  err: ValidationError,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  // Если это не ошибка валидации, передаем дальше
  if (!err.errors) {
    return next(err);
  }

  // Логируем ошибку
  logger.warn(`Validation Error: ${JSON.stringify(err.errors)}`);

  // Формируем сообщения об ошибках
  const errorMessages = Object.values(err.errors).map((e) => e.message);

  // Отправляем ответ с ошибками валидации
  res.status(400).json({
    success: false,
    error: 'Validation Error',
    messages: errorMessages,
  });
};
