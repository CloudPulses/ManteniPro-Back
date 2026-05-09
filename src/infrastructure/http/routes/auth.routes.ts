import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Esta ruta no requiere autenticación
router.post('/login', AuthController.login);

export default router;
