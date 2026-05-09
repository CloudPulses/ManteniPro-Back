import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de clientes requieren autenticación
router.use(authenticateToken);

router.post('/', ClientController.create);
router.get('/', ClientController.getAll);
router.get('/:id', ClientController.getById);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.delete);

export default router;
