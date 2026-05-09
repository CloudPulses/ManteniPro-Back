export class Client {
  constructor(
    public id: number,
    public uuid: string,
    public tenantId: number,
    public clientTypeId: number,
    public statusId: number,
    public displayName: string,
    public notes: string | null,
    public active: boolean,
    public createdByUserId: number | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
