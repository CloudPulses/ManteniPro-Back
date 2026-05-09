import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/models/User';
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
    
    const row = res.rows[0];
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

  async updateLastLogin(userId: number): Promise<void> {
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]);
  }
}
