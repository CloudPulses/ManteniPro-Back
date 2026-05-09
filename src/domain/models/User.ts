export class User {
  constructor(
    public id: number,
    public uuid: string,
    public tenantId: number,
    public roleId: number,
    public name: string,
    public email: string,
    public passwordHash: string,
    public active: boolean
  ) {}
}
