export interface LoginDTO {
  tenantSlug: string;
  email: string;
  password: string;
}

export interface RegisterDTO {
  tenantSlug: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  roleId: number;
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
