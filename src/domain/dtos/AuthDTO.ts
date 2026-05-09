export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: number;
    uuid: string;
    tenantId: number;
    roleId: number;
    name: string;
    email: string;
  };
}
