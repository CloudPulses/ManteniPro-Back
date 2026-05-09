import { MaintenanceRepository } from '../../../domain/repositories/MaintenanceRepository';
import { MaintenanceOrder, MaintenanceExecution } from '../../../domain/models/Maintenance';
import { CreateMaintenanceOrderDTO, CloseMaintenanceDTO } from '../../../domain/dtos/MaintenanceDTO';
import { query } from '../../../config/db';

export class PostgresMaintenanceRepository implements MaintenanceRepository {
  async createOrder(tenantId: number, createdByUserId: number, data: CreateMaintenanceOrderDTO): Promise<MaintenanceOrder> {
    // status_id = 1 (Por ejemplo, "Programado")
    const sql = `
      INSERT INTO maintenance_orders (
        uuid, tenant_id, client_id, equipment_id, service_id, scheduled_date, scheduled_time, assigned_user_id, status_id, notes, created_by_user_id
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 1, $8, $9)
      RETURNING *
    `;
    const res = await query(sql, [
      tenantId, data.clientId, data.equipmentId || null, data.serviceId, data.scheduledDate, data.scheduledTime,
      data.assignedUserId, data.notes || null, createdByUserId
    ]);
    
    const row = res.rows[0];
    return new MaintenanceOrder(
      row.id, row.uuid, row.tenant_id, row.client_id, row.equipment_id, row.service_id, row.scheduled_date,
      row.scheduled_time, row.assigned_user_id, row.status_id, row.notes
    );
  }

  async closeOrder(tenantId: number, orderId: number, userId: number, data: CloseMaintenanceDTO): Promise<MaintenanceExecution> {
    // 1. Verificar orden
    const orderRes = await query('SELECT * FROM maintenance_orders WHERE tenant_id = $1 AND id = $2', [tenantId, orderId]);
    if (orderRes.rows.length === 0) throw new Error('Orden de mantenimiento no encontrada');

    // 2. Insertar Ejecución
    const sqlExec = `
      INSERT INTO maintenance_executions (
        uuid, tenant_id, maintenance_order_id, diagnostic, work_done, warranty_applies, completed_at, completed_by_user_id
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), $6)
      RETURNING *
    `;
    const res = await query(sqlExec, [
      tenantId, orderId, data.diagnostic || null, data.workDone, data.warrantyApplies || false, userId
    ]);

    // 3. Actualizar estado de la orden a Completado (por ejemplo, status_id = 4)
    await query('UPDATE maintenance_orders SET status_id = 4 WHERE tenant_id = $1 AND id = $2', [tenantId, orderId]);

    const row = res.rows[0];
    return new MaintenanceExecution(
      row.id, row.uuid, row.tenant_id, row.maintenance_order_id, row.diagnostic, row.work_done, row.warranty_applies,
      row.completed_at, row.completed_by_user_id
    );
  }
}
