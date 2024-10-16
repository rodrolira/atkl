export interface Admin {
    username: string;
    password: string;
    email: string
}

export interface AdminAuthContextType {
    signup: (user: Omit<Admin, 'id'>) => Promise<void>;
    signout: () => Promise<void>;
    signin: (credentials: any) => Promise<void>; // Agregado
    loading: boolean;
    user: Admin | null;
    isAuthenticated: boolean;
    errors: string[];
}