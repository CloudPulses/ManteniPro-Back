import { Request, Response } from 'express';
import { PostgresUserRepository } from '../../database/postgres/PostgresUserRepository';
import { Argon2PasswordService } from '../../services/Argon2PasswordService';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase';
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase';

const userRepository = new PostgresUserRepository();
const passwordService = new Argon2PasswordService();
const loginUseCase = new LoginUseCase(userRepository, passwordService);
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService);

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      console.log('[AUTH LOGIN] Body recibido:', JSON.stringify(req.body));
      const authResponse = await loginUseCase.execute(req.body);
      res.status(200).json(authResponse);
    } catch (error: any) {
      console.error('[AUTH LOGIN] Error:', error.message, error.stack);
      res.status(401).json({ message: error.message });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      console.log('[AUTH REGISTER] Body recibido:', JSON.stringify(req.body));
      const user = await registerUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      console.error('[AUTH REGISTER] Error:', error.message, error.stack);
      res.status(400).json({ message: error.message });
    }
  }
}
