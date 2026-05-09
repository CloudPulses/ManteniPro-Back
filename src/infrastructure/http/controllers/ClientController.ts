import { Response } from 'express';
import { CreateClientUseCase } from '../../../application/use-cases/CreateClientUseCase';
import { PostgresClientRepository } from '../../database/postgres/PostgresClientRepository';
import { AuthRequest } from '../middlewares/auth.middleware';

const clientRepository = new PostgresClientRepository();
const createClientUseCase = new CreateClientUseCase(clientRepository);

export class ClientController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { tenantId, id: userId } = req.user;
      const client = await createClientUseCase.execute(tenantId, userId, req.body);
      
      res.status(201).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { tenantId } = req.user;
      const clients = await clientRepository.findAll(tenantId);
      res.status(200).json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Agregar métodos de getById, update, delete usando el repositorio...
}
