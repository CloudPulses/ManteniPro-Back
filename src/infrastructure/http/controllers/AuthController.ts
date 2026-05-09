import { Response } from 'express';
import { PostgresUserRepository } from '../../database/postgres/PostgresUserRepository';
import { Argon2PasswordService } from '../../services/Argon2PasswordService';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase';
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase';
import { AuthRequest } from '../middlewares/auth.middleware';

const userRepository = new PostgresUserRepository();
const passwordService = new Argon2PasswordService();
const loginUseCase = new LoginUseCase(userRepository, passwordService);
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService);

export class AuthController {
  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const authResponse = await loginUseCase.execute(req.body);
      res.status(200).json(authResponse);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) { res.status(401).end(); return; }
      const user = await registerUserUseCase.execute(req.user.tenantId, req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
