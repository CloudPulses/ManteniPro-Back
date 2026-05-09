import { Response } from 'express';
import { CreateClientUseCase } from '../../../application/use-cases/CreateClientUseCase';
import { PostgresClientRepository } from '../../database/postgres/PostgresClientRepository';
import { AuthRequest } from '../middlewares/auth.middleware';

const clientRepository = new PostgresClientRepository();
const createClientUseCase = new CreateClientUseCase(clientRepository);

export class ClientController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const { tenantId, id: userId } = req.user;
      const client = await createClientUseCase.execute(tenantId, userId, req.body);
      res.status(201).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const clients = await clientRepository.findAll(req.user.tenantId);
      res.status(200).json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const id = parseInt(req.params.id as string, 10);
      const client = await clientRepository.findById(req.user.tenantId, id);
      if (!client) { res.status(404).json({ message: 'Cliente no encontrado' }); return; }
      res.status(200).json(client);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const id = parseInt(req.params.id as string, 10);
      const client = await clientRepository.update(req.user.tenantId, id, req.body);
      if (!client) { res.status(404).json({ message: 'Cliente no encontrado' }); return; }
      res.status(200).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const id = parseInt(req.params.id as string, 10);
      const success = await clientRepository.delete(req.user.tenantId, id);
      if (success) res.status(200).json({ message: 'Cliente eliminado' });
      else res.status(404).json({ message: 'Cliente no encontrado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
