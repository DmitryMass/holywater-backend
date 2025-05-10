import { Router } from 'express';
import * as screenConfigController from '../controllers/screenConfig.controller';

const router = Router();

/**
 * @route GET /api/screen
 * @desc Получить активную конфигурацию экрана
 * @access Public
 */
router.get('/screen', screenConfigController.getActiveScreenConfig);

/**
 * @route GET /api/screen-configs
 * @desc Получить все конфигурации экрана
 * @access Public
 */
router.get('/screen-configs', screenConfigController.getAllScreenConfigs);

/**
 * @route GET /api/screen-configs/:id
 * @desc Получить конфигурацию экрана по ID
 * @access Public
 */
router.get('/screen-configs/:id', screenConfigController.getScreenConfigById);

/**
 * @route POST /api/screen-configs
 * @desc Создать новую конфигурацию экрана
 * @access Public
 */
router.post('/screen-configs', screenConfigController.createScreenConfig);

/**
 * @route PUT /api/screen-configs/:id
 * @desc Обновить конфигурацию экрана
 * @access Public
 */
router.put('/screen-configs/:id', screenConfigController.updateScreenConfig);

/**
 * @route PUT /api/screen-configs/:id/activate
 * @desc Активировать конфигурацию экрана
 * @access Public
 */
router.put(
  '/screen-configs/:id/activate',
  screenConfigController.activateScreenConfig
);

/**
 * @route DELETE /api/screen-configs/:id
 * @desc Удалить конфигурацию экрана
 * @access Public
 */
router.delete('/screen-configs/:id', screenConfigController.deleteScreenConfig);

export default router;
