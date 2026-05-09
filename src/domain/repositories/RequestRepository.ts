import { IncomingRequest } from '../models/Request';
import { RequestListDTO } from '../dtos/RequestDTO';

export interface RequestRepository {
  findAll(tenantId: number): Promise<RequestListDTO[]>;
  findById(tenantId: number, id: number): Promise<IncomingRequest | null>;
  assignOperator(tenantId: number, id: number, operatorUserId: number): Promise<boolean>;
  discard(tenantId: number, id: number, reason: string): Promise<boolean>;
}
