export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'gestor' | 'coder';
}

export interface LoginDTO {
  email: string;
  password: string;
}
