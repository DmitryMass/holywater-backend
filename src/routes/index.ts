import { Router } from 'express';
import healthRoutes from './health.routes';
import screenConfigRoutes from './screenConfig.routes';

const router = Router();

router.use(healthRoutes);
router.use(screenConfigRoutes);

export default router;
