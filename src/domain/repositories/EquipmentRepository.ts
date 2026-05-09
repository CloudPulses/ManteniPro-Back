import { Equipment } from '../models/Equipment';
import { CreateEquipmentDTO, UpdateEquipmentDTO } from '../dtos/EquipmentDTO';

export interface EquipmentRepository {
  findAll(tenantId: number): Promise<Equipment[]>;
  findById(tenantId: number, id: number): Promise<Equipment | null>;
  create(tenantId: number, data: CreateEquipmentDTO): Promise<Equipment>;
  update(tenantId: number, id: number, data: UpdateEquipmentDTO): Promise<Equipment | null>;
  delete(tenantId: number, id: number): Promise<boolean>;
}
