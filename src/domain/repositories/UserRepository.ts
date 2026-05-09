import { User } from '../models/User';
import { RegisterDTO } from '../dtos/AuthDTO';

export interface UserRepository {
  findByTenantSlugAndEmail(tenantSlug: string, email: string): Promise<User | null>;
  findByTenantAndEmail(tenantId: number, email: string): Promise<User | null>;
  create(tenantId: number, data: RegisterDTO, hashedPassword: string): Promise<User>;
  updateLastLogin(userId: number): Promise<void>;
}
