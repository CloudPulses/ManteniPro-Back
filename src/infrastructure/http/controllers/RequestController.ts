import { Response } from 'express';
import { PostgresRequestRepository } from '../../database/postgres/PostgresRequestRepository';
import { AssignRequestUseCase } from '../../../application/use-cases/AssignRequestUseCase';
import { DiscardRequestUseCase } from '../../../application/use-cases/DiscardRequestUseCase';
import { AuthRequest } from '../middlewares/auth.middleware';

const requestRepository = new PostgresRequestRepository();
const assignRequestUseCase = new AssignRequestUseCase(requestRepository);
const discardRequestUseCase = new DiscardRequestUseCase(requestRepository);

export class RequestController {
  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const requests = await requestRepository.findAll(req.user.tenantId);
      res.status(200).json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async assign(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const requestId = parseInt(req.params.id as string, 10);
      const { operatorUserId } = req.body;
      
      const success = await assignRequestUseCase.execute(req.user.tenantId, requestId, operatorUserId);
      if (success) res.status(200).json({ message: 'Petición asignada exitosamente.' });
      else res.status(400).json({ message: 'No se pudo asignar la petición.' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async discard(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const requestId = parseInt(req.params.id as string, 10);
      const { reason } = req.body;

      const success = await discardRequestUseCase.execute(req.user.tenantId, requestId, reason);
      if (success) res.status(200).json({ message: 'Petición descartada exitosamente.' });
      else res.status(400).json({ message: 'No se pudo descartar la petición.' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
