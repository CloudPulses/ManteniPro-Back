import { DashboardRepository } from '../../domain/repositories/DashboardRepository';
import { DashboardStatsDTO } from '../../domain/dtos/DashboardDTO';

export class GetDashboardStatsUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(tenantId: number): Promise<DashboardStatsDTO> {
    return this.dashboardRepository.getStats(tenantId);
  }
}
