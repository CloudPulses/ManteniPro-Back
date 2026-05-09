import { Router } from 'express';
import { MaintenanceController } from '../controllers/MaintenanceController';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/orders', MaintenanceController.createOrder);
router.post('/orders/:id/close', MaintenanceController.closeOrder);

export default router;
