export interface CreateEquipmentDTO {
  clientId: number;
  equipmentTypeId: number;
  currentStatusId: number;
  internalCode: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
}

export interface UpdateEquipmentDTO {
  currentStatusId?: number;
  brand?: string;
  model?: string;
  serialNumber?: string;
  active?: boolean;
}
