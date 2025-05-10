import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import ScreenConfig from '../models/screenConfig.model';
import { logger } from '../utils/logger';
import {
  ApiResponse,
  TypedRequestBody,
  CreateScreenConfigDto,
  UpdateScreenConfigDto,
} from '../utils/types';

// Расширяем типы для обработки запросов с параметрами
interface RequestWithParams extends Request {
  params: {
    id: string;
    [key: string]: string;
  };
}

/**
 * Получить все конфигурации экрана с пагинацией
 */
export const getAllScreenConfigs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Параметры пагинации
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Рассчитываем смещение для пагинации
    const skip = (page - 1) * limit;

    // Получаем общее количество документов
    const total = await ScreenConfig.countDocuments();

    // Получаем документы с применением пагинации
    const screenConfigs = await ScreenConfig.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Формируем ответ
    const response: ApiResponse = {
      success: true,
      data: {
        data: screenConfigs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Error getting screen configs:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get screen configs',
    };
    res.status(500).json(response);
  }
};

/**
 * Получить активную конфигурацию экрана
 */
export const getActiveScreenConfig = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const screenConfig = await ScreenConfig.findOne({ isActive: true });

    if (!screenConfig) {
      const response: ApiResponse = {
        success: false,
        error: 'No active screen configuration found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: screenConfig,
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Error getting active screen config:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get active screen configuration',
    };
    res.status(500).json(response);
  }
};

/**
 * Получить конфигурацию экрана по ID
 */
export const getScreenConfigById = async (
  req: RequestWithParams,
  res: Response
): Promise<void> => {
  try {
    const screenConfig = await ScreenConfig.findById(req.params.id);

    if (!screenConfig) {
      const response: ApiResponse = {
        success: false,
        error: 'Screen configuration not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: screenConfig,
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `Error getting screen config with ID ${req.params.id}:`,
      error
    );
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get screen configuration',
    };
    res.status(500).json(response);
  }
};

/**
 * Создать новую конфигурацию экрана
 */
export const createScreenConfig = async (
  req: TypedRequestBody<CreateScreenConfigDto>,
  res: Response
): Promise<void> => {
  try {
    // Генерируем уникальные ID для секций и элементов, если они не указаны
    const sections =
      req.body.sections?.map((section) => ({
        ...section,
        id: section.id || uuidv4(),
        items:
          section.items?.map((item) => ({
            ...item,
            id: item.id || uuidv4(),
          })) || [],
      })) || [];

    // Создаем новую конфигурацию
    const screenConfig = new ScreenConfig({
      name: req.body.name,
      sections: sections,
      isActive: req.body.isActive || false,
      version: 1,
    });

    await screenConfig.save();

    // Если установлен флаг активной конфигурации, деактивируем остальные
    if (screenConfig.isActive) {
      await ScreenConfig.updateMany(
        { _id: { $ne: screenConfig._id } },
        { $set: { isActive: false } }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: screenConfig,
      message: 'Screen configuration created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Error creating screen config:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create screen configuration',
    };
    res.status(500).json(response);
  }
};

/**
 * Обновить конфигурацию экрана
 */
export const updateScreenConfig = async (
  req: TypedRequestBody<UpdateScreenConfigDto> & RequestWithParams,
  res: Response
): Promise<void> => {
  try {
    const screenConfig = await ScreenConfig.findById(req.params.id);

    if (!screenConfig) {
      const response: ApiResponse = {
        success: false,
        error: 'Screen configuration not found',
      };
      res.status(404).json(response);
      return;
    }

    // Обновляем данные
    if (req.body.name) screenConfig.name = req.body.name;
    if (req.body.sections) screenConfig.sections = req.body.sections;

    // Обрабатываем изменение статуса активности
    if (req.body.isActive !== undefined) {
      const wasActive = screenConfig.isActive;
      screenConfig.isActive = req.body.isActive;

      // Если конфигурация становится активной, деактивируем остальные
      if (req.body.isActive && !wasActive) {
        await ScreenConfig.updateMany(
          { _id: { $ne: screenConfig._id } },
          { $set: { isActive: false } }
        );
      }
    }

    // Увеличиваем версию
    screenConfig.version = (screenConfig.version || 0) + 1;

    await screenConfig.save();

    const response: ApiResponse = {
      success: true,
      data: screenConfig,
      message: 'Screen configuration updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `Error updating screen config with ID ${req.params.id}:`,
      error
    );
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update screen configuration',
    };
    res.status(500).json(response);
  }
};

/**
 * Активировать конфигурацию экрана
 */
export const activateScreenConfig = async (
  req: RequestWithParams,
  res: Response
): Promise<void> => {
  try {
    const screenConfig = await ScreenConfig.findById(req.params.id);

    if (!screenConfig) {
      const response: ApiResponse = {
        success: false,
        error: 'Screen configuration not found',
      };
      res.status(404).json(response);
      return;
    }

    // Если конфигурация уже активна, возвращаем успех
    if (screenConfig.isActive) {
      const response: ApiResponse = {
        success: true,
        data: screenConfig,
        message: 'Screen configuration is already active',
      };
      res.status(200).json(response);
      return;
    }

    // Деактивируем все другие конфигурации
    await ScreenConfig.updateMany({}, { $set: { isActive: false } });

    // Активируем текущую конфигурацию
    screenConfig.isActive = true;
    await screenConfig.save();

    const response: ApiResponse = {
      success: true,
      data: screenConfig,
      message: 'Screen configuration activated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `Error activating screen config with ID ${req.params.id}:`,
      error
    );
    const response: ApiResponse = {
      success: false,
      error: 'Failed to activate screen configuration',
    };
    res.status(500).json(response);
  }
};

/**
 * Удалить конфигурацию экрана
 */
export const deleteScreenConfig = async (
  req: RequestWithParams,
  res: Response
): Promise<void> => {
  try {
    const screenConfig = await ScreenConfig.findById(req.params.id);

    if (!screenConfig) {
      const response: ApiResponse = {
        success: false,
        error: 'Screen configuration not found',
      };
      res.status(404).json(response);
      return;
    }

    // Если удаляем активную конфигурацию, логируем это событие
    if (screenConfig.isActive) {
      logger.warn(
        `Deleting active screen configuration with ID ${req.params.id}`
      );
    }

    await ScreenConfig.findByIdAndDelete(req.params.id);

    const response: ApiResponse = {
      success: true,
      message: 'Screen configuration deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `Error deleting screen config with ID ${req.params.id}:`,
      error
    );
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete screen configuration',
    };
    res.status(500).json(response);
  }
};
