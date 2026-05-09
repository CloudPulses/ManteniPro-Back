import { RequestRepository } from '../../domain/repositories/RequestRepository';

export class DiscardRequestUseCase {
  constructor(private requestRepository: RequestRepository) {}

  async execute(tenantId: number, requestId: number, reason: string): Promise<boolean> {
    if (!reason || reason.trim() === '') {
      throw new Error('El motivo de descarte es obligatorio.');
    }
    const request = await this.requestRepository.findById(tenantId, requestId);
    if (!request) {
      throw new Error('Petición no encontrada.');
    }
    return this.requestRepository.discard(tenantId, requestId, reason);
  }
}
