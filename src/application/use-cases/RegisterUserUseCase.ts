import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordService } from '../../domain/services/PasswordService';
import { RegisterDTO } from '../../domain/dtos/AuthDTO';
import { User } from '../../domain/models/User';

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService
  ) {}

  async execute(data: RegisterDTO): Promise<Omit<User, 'passwordHash'>> {
    if (!data.tenantSlug || !data.name || !data.email || !data.password) {
      throw new Error('tenantSlug, nombre, email y contraseña son obligatorios.');
    }

    if (data.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    // Resolver tenant por slug
    const tenantId = await this.userRepository.findTenantIdBySlug(data.tenantSlug);
    if (!tenantId) {
      throw new Error('Organización no encontrada.');
    }

    // Verificar que el email no exista ya en el tenant
    const existingUser = await this.userRepository.findByTenantAndEmail(tenantId, data.email);
    if (existingUser) {
      throw new Error('Ya existe un usuario con ese email en esta organización.');
    }

    const hashedPassword = await this.passwordService.hash(data.password);
    const user = await this.userRepository.create(tenantId, data, hashedPassword);

    // Retornar sin el hash
    return {
      id: user.id,
      uuid: user.uuid,
      tenantId: user.tenantId,
      roleId: user.roleId,
      name: user.name,
      email: user.email,
      active: user.active
    };
  }
}
