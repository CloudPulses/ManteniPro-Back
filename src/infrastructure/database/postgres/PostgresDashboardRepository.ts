import { DashboardRepository } from '../../../domain/repositories/DashboardRepository';
import { DashboardStatsDTO, UpcomingMaintenanceDTO } from '../../../domain/dtos/DashboardDTO';
import { query } from '../../../config/db';

export class PostgresDashboardRepository implements DashboardRepository {
  async getStats(tenantId: number): Promise<DashboardStatsDTO> {
    const upcomingSql = `
      SELECT 
        mo.id,
        mo.uuid,
        mo.scheduled_date as "scheduledDate",
        mo.scheduled_time as "scheduledTime",
        c.display_name as "clientName",
        sc.name as "serviceName",
        u.name as "operatorName",
        ms.name as "statusName"
      FROM maintenance_orders mo
      JOIN clients c ON mo.client_id = c.id
      JOIN service_catalog sc ON mo.service_id = sc.id
      JOIN users u ON mo.assigned_user_id = u.id
      JOIN maintenance_statuses ms ON mo.status_id = ms.id
      WHERE mo.tenant_id = $1 AND mo.scheduled_date >= CURRENT_DATE
      ORDER BY mo.scheduled_date ASC, mo.scheduled_time ASC
      LIMIT 20
    `;

    const res = await query(upcomingSql, [tenantId]);

    const upcomingMaintenances: UpcomingMaintenanceDTO[] = res.rows.map(row => ({
      id: row.id,
      uuid: row.uuid,
      scheduledDate: row.scheduledDate,
      scheduledTime: row.scheduledTime,
      clientName: row.clientName,
      serviceName: row.serviceName,
      operatorName: row.operatorName,
      statusName: row.statusName,
    }));

    return {
      upcomingMaintenances,
    };
  }
}
