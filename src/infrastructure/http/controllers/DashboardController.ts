import { Response } from 'express';
import { GetDashboardStatsUseCase } from '../../../application/use-cases/GetDashboardStatsUseCase';
import { PostgresDashboardRepository } from '../../database/postgres/PostgresDashboardRepository';
import { AuthRequest } from '../middlewares/auth.middleware';

const dashboardRepository = new PostgresDashboardRepository();
const getDashboardStatsUseCase = new GetDashboardStatsUseCase(dashboardRepository);

export class DashboardController {
  static async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { tenantId } = req.user;
      const stats = await getDashboardStatsUseCase.execute(tenantId);
      
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
