import { MaintenanceRepository } from '../../../domain/repositories/MaintenanceRepository';
import { MaintenanceOrder } from '../../../domain/models/Maintenance';
import { CreateMaintenanceOrderDTO, CloseMaintenanceDTO, CloseMaintenanceResponseDTO } from '../../../domain/dtos/MaintenanceDTO';
import { query } from '../../../config/db';

export class PostgresMaintenanceRepository implements MaintenanceRepository {
  async createOrder(tenantId: number, createdByUserId: number, data: CreateMaintenanceOrderDTO): Promise<MaintenanceOrder> {
    const sql = `
      INSERT INTO maintenance_orders (
        uuid, tenant_id, client_id, equipment_id, address_id, service_id, 
        scheduled_date, scheduled_time, assigned_user_id, status_id, priority, notes, created_by_user_id
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, 1, $9, $10, $11)
      RETURNING *
    `;
    const res = await query(sql, [
      tenantId,
      data.clientId,
      data.equipmentId || null,
      data.addressId || null,
      data.serviceId,
      data.scheduledDate,
      data.scheduledTime,
      data.assignedUserId,
      data.priority || 'MEDIUM',
      data.notes || null,
      createdByUserId
    ]);
    
    const row = res.rows[0];
    return new MaintenanceOrder(
      row.id, row.uuid, row.tenant_id, row.client_id, row.equipment_id, row.service_id, row.scheduled_date,
      row.scheduled_time, row.assigned_user_id, row.status_id, row.notes
    );
  }

  async closeOrder(tenantId: number, orderId: number, userId: number, data: CloseMaintenanceDTO): Promise<CloseMaintenanceResponseDTO> {
    // 1. Verificar orden y obtener datos relacionados
    const orderRes = await query(
      `SELECT mo.*, c.display_name as client_name, e.internal_code as equipment_code
       FROM maintenance_orders mo
       JOIN clients c ON mo.client_id = c.id
       LEFT JOIN equipments e ON mo.equipment_id = e.id
       WHERE mo.tenant_id = $1 AND mo.id = $2`,
      [tenantId, orderId]
    );
    if (orderRes.rows.length === 0) throw new Error('Orden de mantenimiento no encontrada');

    const order = orderRes.rows[0];

    // 2. Insertar Ejecución
    const sqlExec = `
      INSERT INTO maintenance_executions (
        uuid, tenant_id, maintenance_order_id, diagnostic, work_done, 
        warranty_applies, warranty_details, recommendations, completed_at, completed_by_user_id
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), $8)
      RETURNING *
    `;
    const res = await query(sqlExec, [
      tenantId,
      orderId,
      data.diagnostic || null,
      data.workDone,
      data.warrantyApplies || false,
      data.warrantyDetails || null,
      data.recommendations || null,
      userId
    ]);

    // 3. Actualizar estado de la orden a Completado (status_id = 4)
    await query('UPDATE maintenance_orders SET status_id = 4 WHERE tenant_id = $1 AND id = $2', [tenantId, orderId]);

    const row = res.rows[0];
    return {
      id: row.id,
      uuid: row.uuid,
      orderId: order.id,
      orderUuid: order.uuid,
      clientName: order.client_name,
      equipmentReference: order.equipment_code || null,
      diagnostic: row.diagnostic,
      workDone: row.work_done,
      warrantyApplies: row.warranty_applies,
      completedAt: row.completed_at
    };
  }
}
