import { Response } from 'express';
import { PostgresMaintenanceRepository } from '../../database/postgres/PostgresMaintenanceRepository';
import { AuthRequest } from '../middlewares/auth.middleware';

const maintenanceRepository = new PostgresMaintenanceRepository();

export class MaintenanceController {
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const order = await maintenanceRepository.createOrder(req.user.tenantId, req.user.id, req.body);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async closeOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const orderId = parseInt(req.params.id as string, 10);
      const execution = await maintenanceRepository.closeOrder(req.user.tenantId, orderId, req.user.id, req.body);
      res.status(200).json(execution);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
