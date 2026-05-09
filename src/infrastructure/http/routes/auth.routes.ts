import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Ruta pública
router.post('/login', AuthController.login);

// Ruta protegida (solo usuarios autenticados pueden registrar nuevos usuarios)
router.post('/register', authenticateToken, AuthController.register);

export default router;
