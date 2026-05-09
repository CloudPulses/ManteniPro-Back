import { Router } from 'express';
import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import dashboardRoutes from './dashboard.routes';
import requestRoutes from './request.routes';
import equipmentRoutes from './equipment.routes';
import maintenanceRoutes from './maintenance.routes';

const router = Router();

// Rutas Públicas
router.use('/auth', authRoutes);

// Rutas Privadas (Protegidas por auth.middleware internamente en cada router)
router.use('/clients', clientRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/requests', requestRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/maintenances', maintenanceRoutes);

export default router;
