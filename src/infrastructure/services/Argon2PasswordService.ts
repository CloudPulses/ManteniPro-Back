import argon2 from 'argon2';
import { PasswordService } from '../../domain/services/PasswordService';

export class Argon2PasswordService implements PasswordService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,   // 64 MB
      timeCost: 3,         // 3 iteraciones
      parallelism: 4,      // 4 hilos
    });
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
