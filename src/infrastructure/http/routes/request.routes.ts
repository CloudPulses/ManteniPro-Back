import { Router } from 'express';
import { RequestController } from '../controllers/RequestController';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', RequestController.getAll);
router.post('/:id/assign', RequestController.assign);
router.post('/:id/discard', RequestController.discard);

export default router;
