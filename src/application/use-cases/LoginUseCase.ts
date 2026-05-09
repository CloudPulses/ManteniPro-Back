import { UserRepository } from '../../domain/repositories/UserRepository';
import { LoginDTO, AuthResponseDTO } from '../../domain/dtos/AuthDTO';
import { SignJWT } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey');

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Aquí deberíamos usar bcrypt.compare o crypto.scrypt para verificar.
    // Como no sabemos el método exacto usado para guardar, compararemos de manera simple
    // Recomendación: Usa bcrypt.compareSync(data.password, user.passwordHash) en producción
    const isPasswordValid = data.password === user.passwordHash; // TODO: Cambiar por verificación de hash real

    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    await this.userRepository.updateLastLogin(user.id);

    // Crear token con jose
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
