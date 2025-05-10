import { Request } from 'express';
import { IScreenConfig } from '../models/screenConfig.model';

/**
 * Расширенный интерфейс запроса для Express с типизацией
 */
export interface TypedRequestBody<T> extends Request {
  body: T;
}

/**
 * Интерфейс ответа API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Интерфейс для создания конфигурации экрана
 */
export type CreateScreenConfigDto = Omit<
  IScreenConfig,
  'id' | 'createdAt' | 'updatedAt' | 'version'
>;

/**
 * Интерфейс для обновления конфигурации экрана
 */
export type UpdateScreenConfigDto = Partial<CreateScreenConfigDto>;

/**
 * Интерфейс для пагинации результатов
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Интерфейс для пагинированного результата
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
