import { Router } from 'express';
import { EquipmentController } from '../controllers/EquipmentController';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', EquipmentController.getAll);
router.get('/:id', EquipmentController.getById);
router.post('/', EquipmentController.create);
router.put('/:id', EquipmentController.update);
router.delete('/:id', EquipmentController.delete);

export default router;
