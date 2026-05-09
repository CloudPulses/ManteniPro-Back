import { Client } from '../models/Client';
import { CreateClientDTO, UpdateClientDTO } from '../dtos/ClientDTO';

export interface ClientRepository {
  findById(tenantId: number, id: number): Promise<Client | null>;
  findAll(tenantId: number): Promise<Client[]>;
  create(tenantId: number, userId: number, data: CreateClientDTO): Promise<Client>;
  update(tenantId: number, id: number, data: UpdateClientDTO): Promise<Client | null>;
  delete(tenantId: number, id: number): Promise<boolean>;
}
