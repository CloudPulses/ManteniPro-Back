export interface CreateMaintenanceOrderDTO {
  clientId: number;
  equipmentId?: number;
  addressId?: number;
  serviceId: number;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm:ss
  assignedUserId: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes?: string;
}

export interface CloseMaintenanceDTO {
  diagnostic?: string;
  workDone: string;
  warrantyApplies?: boolean;
  warrantyDetails?: string;
  recommendations?: string;
}

export interface CloseMaintenanceResponseDTO {
  id: number;
  uuid: string;
  orderId: number;
  orderUuid: string;
  clientName: string;
  equipmentReference: string | null;
  diagnostic: string | null;
  workDone: string;
  warrantyApplies: boolean;
  completedAt: Date;
}
