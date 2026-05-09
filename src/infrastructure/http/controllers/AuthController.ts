import { Response, Request } from 'express';
import { PostgresUserRepository } from '../../database/postgres/PostgresUserRepository';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase';

const userRepository = new PostgresUserRepository();
const loginUseCase = new LoginUseCase(userRepository);

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const authResponse = await loginUseCase.execute(req.body);
      res.status(200).json(authResponse);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
