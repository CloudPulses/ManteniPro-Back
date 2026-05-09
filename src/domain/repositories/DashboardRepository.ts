import { DashboardStatsDTO } from '../dtos/DashboardDTO';

export interface DashboardRepository {
  getStats(tenantId: number): Promise<DashboardStatsDTO>;
}
