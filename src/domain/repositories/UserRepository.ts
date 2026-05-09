import { User } from '../models/User';

export interface UserRepository {
  findByTenantSlugAndEmail(tenantSlug: string, email: string): Promise<User | null>;
  updateLastLogin(userId: number): Promise<void>;
}
