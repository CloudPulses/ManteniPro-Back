export class Equipment {
  constructor(
    public id: number,
    public uuid: string,
    public tenantId: number,
    public clientId: number,
    public equipmentTypeId: number,
    public currentStatusId: number,
    public internalCode: string,
    public brand: string | null,
    public model: string | null,
    public serialNumber: string | null,
    public active: boolean
  ) {}
}
