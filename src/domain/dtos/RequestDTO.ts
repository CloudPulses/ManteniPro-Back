export interface RequestListDTO {
  id: number;
  uuid: string;
  consecutive: number; // Suponemos que es el ID por simplicidad, o un campo extra
  clientTypeName: string;
  companyName: string;
  email: string | null;
  phone: string | null;
  statusName: string;
  createdAt: Date;
}

export interface DiscardRequestDTO {
  reason: string;
}

export interface AssignRequestDTO {
  operatorUserId: number;
}
