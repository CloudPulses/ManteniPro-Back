import { MaintenanceOrder, MaintenanceExecution } from '../models/Maintenance';
import { CreateMaintenanceOrderDTO, CloseMaintenanceDTO } from '../dtos/MaintenanceDTO';

export interface MaintenanceRepository {
  createOrder(tenantId: number, createdByUserId: number, data: CreateMaintenanceOrderDTO): Promise<MaintenanceOrder>;
  closeOrder(tenantId: number, orderId: number, userId: number, data: CloseMaintenanceDTO): Promise<MaintenanceExecution>;
}
