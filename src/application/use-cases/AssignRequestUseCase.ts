import { RequestRepository } from '../../domain/repositories/RequestRepository';

export class AssignRequestUseCase {
  constructor(private requestRepository: RequestRepository) {}

  async execute(tenantId: number, requestId: number, operatorUserId: number): Promise<boolean> {
    const request = await this.requestRepository.findById(tenantId, requestId);
    if (!request) {
      throw new Error('Petición no encontrada.');
    }
    return this.requestRepository.assignOperator(tenantId, requestId, operatorUserId);
  }
}
