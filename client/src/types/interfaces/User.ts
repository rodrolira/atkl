// types/interfaces/User.ts
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user'; // Tipado específico para roles
    [key: string]: any;
  }
  