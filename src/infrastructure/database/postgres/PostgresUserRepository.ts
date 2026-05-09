import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/models/User';
import { RegisterDTO } from '../../../domain/dtos/AuthDTO';
import { query } from '../../../config/db';

export class PostgresUserRepository implements UserRepository {
  async findByTenantSlugAndEmail(tenantSlug: string, email: string): Promise<User | null> {
    const sql = `
      SELECT u.* FROM users u
      JOIN tenants t ON u.tenant_id = t.id
      WHERE t.slug = $1 AND u.email = $2 AND u.active = true AND t.active = true
    `;
    const res = await query(sql, [tenantSlug, email]);
    if (res.rows.length === 0) return null;
    return this.mapToModel(res.rows[0]);
  }

  async findByTenantAndEmail(tenantId: number, email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE tenant_id = $1 AND email = $2 AND active = true';
    const res = await query(sql, [tenantId, email]);
    if (res.rows.length === 0) return null;
    return this.mapToModel(res.rows[0]);
  }

  async findTenantIdBySlug(slug: string): Promise<number | null> {
    const res = await query('SELECT id FROM tenants WHERE slug = $1 AND active = true', [slug]);
    if (res.rows.length === 0) return null;
    return res.rows[0].id;
  }

  async create(tenantId: number, data: RegisterDTO, hashedPassword: string): Promise<User> {
    const sql = `
      INSERT INTO users (uuid, tenant_id, role_id, name, email, phone, password)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const res = await query(sql, [
      tenantId, data.roleId, data.name, data.email, data.phone || null, hashedPassword
    ]);
    return this.mapToModel(res.rows[0]);
  }

  async updateLastLogin(userId: number): Promise<void> {
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]);
  }

  private mapToModel(row: any): User {
    return new User(
      row.id,
      row.uuid,
      row.tenant_id,
      row.role_id,
      row.name,
      row.email,
      row.password,
      row.active
    );
  }
}
