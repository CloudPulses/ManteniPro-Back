import { Pool } from 'pg';
import { ClientRepository } from '../../../domain/repositories/ClientRepository';
import { Client } from '../../../domain/models/Client';
import { CreateClientDTO, UpdateClientDTO } from '../../../domain/dtos/ClientDTO';
import { query } from '../../../config/db';

export class PostgresClientRepository implements ClientRepository {
  async findById(tenantId: number, id: number): Promise<Client | null> {
    const res = await query(
      'SELECT * FROM clients WHERE tenant_id = $1 AND id = $2',
      [tenantId, id]
    );
    if (res.rows.length === 0) return null;
    return this.mapToModel(res.rows[0]);
  }

  async findAll(tenantId: number): Promise<Client[]> {
    const res = await query('SELECT * FROM clients WHERE tenant_id = $1 ORDER BY id DESC', [tenantId]);
    return res.rows.map(this.mapToModel);
  }

  async create(tenantId: number, userId: number, data: CreateClientDTO): Promise<Client> {
    const res = await query(
      `INSERT INTO clients (uuid, tenant_id, client_type_id, status_id, display_name, notes, created_by_user_id)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [tenantId, data.clientTypeId, data.statusId, data.displayName, data.notes || null, userId]
    );
    return this.mapToModel(res.rows[0]);
  }

  async update(tenantId: number, id: number, data: UpdateClientDTO): Promise<Client | null> {
    const fields = [];
    const values = [];
    let count = 1;

    if (data.clientTypeId !== undefined) { fields.push(`client_type_id = $${count++}`); values.push(data.clientTypeId); }
    if (data.statusId !== undefined) { fields.push(`status_id = $${count++}`); values.push(data.statusId); }
    if (data.displayName !== undefined) { fields.push(`display_name = $${count++}`); values.push(data.displayName); }
    if (data.notes !== undefined) { fields.push(`notes = $${count++}`); values.push(data.notes); }
    if (data.active !== undefined) { fields.push(`active = $${count++}`); values.push(data.active); }

    if (fields.length === 0) return this.findById(tenantId, id);

    values.push(tenantId, id);
    const sql = `UPDATE clients SET ${fields.join(', ')} WHERE tenant_id = $${count} AND id = $${count + 1} RETURNING *`;
    
    const res = await query(sql, values);
    if (res.rows.length === 0) return null;
    return this.mapToModel(res.rows[0]);
  }

  async delete(tenantId: number, id: number): Promise<boolean> {
    const res = await query('DELETE FROM clients WHERE tenant_id = $1 AND id = $2 RETURNING id', [tenantId, id]);
    return res.rowCount !== null && res.rowCount > 0;
  }

  private mapToModel(row: any): Client {
    return new Client(
      row.id,
      row.uuid,
      row.tenant_id,
      row.client_type_id,
      row.status_id,
      row.display_name,
      row.notes,
      row.active,
      row.created_by_user_id,
      row.created_at,
      row.updated_at
    );
  }
}
