import { EquipmentRepository } from '../../../domain/repositories/EquipmentRepository';
import { Equipment } from '../../../domain/models/Equipment';
import { CreateEquipmentDTO, UpdateEquipmentDTO } from '../../../domain/dtos/EquipmentDTO';
import { query } from '../../../config/db';

export class PostgresEquipmentRepository implements EquipmentRepository {
  async findAll(tenantId: number): Promise<Equipment[]> {
    const res = await query('SELECT * FROM equipments WHERE tenant_id = $1 ORDER BY id DESC', [tenantId]);
    return res.rows.map(this.mapToModel);
  }

  async create(tenantId: number, data: CreateEquipmentDTO): Promise<Equipment> {
    const sql = `
      INSERT INTO equipments (
        uuid, tenant_id, client_id, equipment_type_id, current_status_id, internal_code, brand, model, serial_number
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const res = await query(sql, [
      tenantId, data.clientId, data.equipmentTypeId, data.currentStatusId, data.internalCode,
      data.brand || null, data.model || null, data.serialNumber || null
    ]);
    return this.mapToModel(res.rows[0]);
  }

  async update(tenantId: number, id: number, data: UpdateEquipmentDTO): Promise<Equipment | null> {
    const fields = [];
    const values = [];
    let count = 1;

    if (data.currentStatusId !== undefined) { fields.push(`current_status_id = $${count++}`); values.push(data.currentStatusId); }
    if (data.brand !== undefined) { fields.push(`brand = $${count++}`); values.push(data.brand); }
    if (data.model !== undefined) { fields.push(`model = $${count++}`); values.push(data.model); }
    if (data.serialNumber !== undefined) { fields.push(`serial_number = $${count++}`); values.push(data.serialNumber); }
    if (data.active !== undefined) { fields.push(`active = $${count++}`); values.push(data.active); }

    if (fields.length === 0) {
      const res = await query('SELECT * FROM equipments WHERE tenant_id = $1 AND id = $2', [tenantId, id]);
      if (res.rows.length === 0) return null;
      return this.mapToModel(res.rows[0]);
    }

    values.push(tenantId, id);
    const sql = `UPDATE equipments SET ${fields.join(', ')} WHERE tenant_id = $${count} AND id = $${count + 1} RETURNING *`;
    
    const res = await query(sql, values);
    if (res.rows.length === 0) return null;
    return this.mapToModel(res.rows[0]);
  }

  async delete(tenantId: number, id: number): Promise<boolean> {
    const res = await query('DELETE FROM equipments WHERE tenant_id = $1 AND id = $2 RETURNING id', [tenantId, id]);
    return res.rowCount !== null && res.rowCount > 0;
  }

  private mapToModel(row: any): Equipment {
    return new Equipment(
      row.id, row.uuid, row.tenant_id, row.client_id, row.equipment_type_id, row.current_status_id,
      row.internal_code, row.brand, row.model, row.serial_number, row.active
    );
  }
}
