export class IncomingRequest {
  constructor(
    public id: number,
    public uuid: string,
    public tenantId: number,
    public clientId: number | null,
    public requesterName: string,
    public phone: string | null,
    public email: string | null,
    public serviceId: number,
    public statusId: number,
    public source: string | null,
    public notes: string | null,
    public assignedToUserId: number | null,
    public discardedReason: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
