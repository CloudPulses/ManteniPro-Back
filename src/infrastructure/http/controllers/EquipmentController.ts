import { Response } from 'express';
import { PostgresEquipmentRepository } from '../../database/postgres/PostgresEquipmentRepository';
import { AuthRequest } from '../middlewares/auth.middleware';

const equipmentRepository = new PostgresEquipmentRepository();

export class EquipmentController {
  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const equipments = await equipmentRepository.findAll(req.user.tenantId);
      res.status(200).json(equipments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const equipment = await equipmentRepository.create(req.user.tenantId, req.body);
      res.status(201).json(equipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const id = parseInt(req.params.id as string, 10);
      const equipment = await equipmentRepository.update(req.user.tenantId, id, req.body);
      if (!equipment) res.status(404).json({ message: 'Equipo no encontrado' });
      else res.status(200).json(equipment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const id = parseInt(req.params.id as string, 10);
      const success = await equipmentRepository.delete(req.user.tenantId, id);
      if (success) res.status(200).json({ message: 'Equipo eliminado' });
      else res.status(404).json({ message: 'Equipo no encontrado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
