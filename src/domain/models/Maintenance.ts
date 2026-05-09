export class MaintenanceOrder {
  constructor(
    public id: number,
    public uuid: string,
    public tenantId: number,
    public clientId: number,
    public equipmentId: number | null,
    public serviceId: number,
    public scheduledDate: Date,
    public scheduledTime: string,
    public assignedUserId: number,
    public statusId: number,
    public notes: string | null
  ) {}
}

export class MaintenanceExecution {
  constructor(
    public id: number,
    public uuid: string,
    public tenantId: number,
    public maintenanceOrderId: number,
    public diagnostic: string | null,
    public workDone: string,
    public warrantyApplies: boolean,
    public completedAt: Date,
    public completedByUserId: number
  ) {}
}
