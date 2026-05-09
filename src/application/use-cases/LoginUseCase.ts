import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordService } from '../../domain/services/PasswordService';
import { LoginDTO, AuthResponseDTO } from '../../domain/dtos/AuthDTO';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey');

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService
  ) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
    if (!data.tenantSlug || !data.email || !data.password) {
      throw new Error('Todos los campos son obligatorios (tenantSlug, email, password).');
    }

    const user = await this.userRepository.findByTenantSlugAndEmail(data.tenantSlug, data.email);
    
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    const isPasswordValid = await this.passwordService.verify(user.passwordHash, data.password);

    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    await this.userRepository.updateLastLogin(user.id);

    const token = await new SignJWT({
      id: user.id,
      uuid: user.uuid,
      tenantId: user.tenantId,
      roleId: user.roleId
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    return {
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        tenantId: user.tenantId,
        roleId: user.roleId,
        name: user.name,
        email: user.email
      }
    };
  }
}
