import { RequestRepository } from '../../../domain/repositories/RequestRepository';
import { IncomingRequest } from '../../../domain/models/Request';
import { RequestListDTO } from '../../../domain/dtos/RequestDTO';
import { query } from '../../../config/db';

export class PostgresRequestRepository implements RequestRepository {
  async findAll(tenantId: number): Promise<RequestListDTO[]> {
    const sql = `
      SELECT 
        r.id,
        r.uuid,
        r.id as "consecutive",
        ct.name as "clientTypeName",
        COALESCE(c.display_name, r.requester_name) as "companyName",
        r.email,
        r.phone,
        rs.name as "statusName",
        r.created_at as "createdAt"
      FROM incoming_requests r
      LEFT JOIN clients c ON r.client_id = c.id
      LEFT JOIN client_types ct ON c.client_type_id = ct.id
      JOIN request_statuses rs ON r.status_id = rs.id
      WHERE r.tenant_id = $1
      ORDER BY r.created_at DESC
    `;
    const res = await query(sql, [tenantId]);
    return res.rows.map(row => ({
      id: row.id,
      uuid: row.uuid,
      consecutive: row.consecutive,
      clientTypeName: row.clientTypeName || 'No registrado',
      companyName: row.companyName,
      email: row.email,
      phone: row.phone,
      statusName: row.statusName,
      createdAt: row.createdAt
    }));
  }

  async findById(tenantId: number, id: number): Promise<IncomingRequest | null> {
    const res = await query('SELECT * FROM incoming_requests WHERE tenant_id = $1 AND id = $2', [tenantId, id]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return new IncomingRequest(
      row.id, row.uuid, row.tenant_id, row.client_id, row.requester_name, row.phone, row.email,
      row.service_id, row.status_id, row.source, row.notes, row.assigned_to_user_id, row.discarded_reason,
      row.created_at, row.updated_at
    );
  }

  async assignOperator(tenantId: number, id: number, operatorUserId: number): Promise<boolean> {
    // status_id = 2 asumiendo que 2 es "Asignado"
    const res = await query(
      'UPDATE incoming_requests SET assigned_to_user_id = $1, status_id = 2 WHERE tenant_id = $2 AND id = $3 RETURNING id',
      [operatorUserId, tenantId, id]
    );
    return res.rowCount !== null && res.rowCount > 0;
  }

  async discard(tenantId: number, id: number, reason: string): Promise<boolean> {
    // status_id = 3 asumiendo que 3 es "Descartado"
    const res = await query(
      'UPDATE incoming_requests SET discarded_reason = $1, status_id = 3 WHERE tenant_id = $2 AND id = $3 RETURNING id',
      [reason, tenantId, id]
    );
    return res.rowCount !== null && res.rowCount > 0;
  }
}
