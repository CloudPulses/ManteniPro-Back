export interface CreateClientDTO {
  clientTypeId: number;
  statusId: number;
  displayName: string;
  notes?: string;
}

export interface UpdateClientDTO {
  clientTypeId?: number;
  statusId?: number;
  displayName?: string;
  notes?: string;
  active?: boolean;
}
