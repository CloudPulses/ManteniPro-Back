import { User } from '../models/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  updateLastLogin(userId: number): Promise<void>;
}
