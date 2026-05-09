import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { CreateClientDTO } from '../../domain/dtos/ClientDTO';
import { Client } from '../../domain/models/Client';

export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(tenantId: number, userId: number, data: CreateClientDTO): Promise<Client> {
    // Aquí puedes agregar validaciones de negocio antes de crear
    if (!data.displayName) {
      throw new Error("El nombre a mostrar (display_name) es obligatorio.");
    }
    return this.clientRepository.create(tenantId, userId, data);
  }
}
