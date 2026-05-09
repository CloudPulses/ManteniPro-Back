export interface CreateMaintenanceOrderDTO {
  clientId: number;
  equipmentId?: number;
  serviceId: number;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm:ss
  assignedUserId: number;
  notes?: string;
}

export interface CloseMaintenanceDTO {
  diagnostic?: string;
  workDone: string;
  warrantyApplies?: boolean;
}
