 export interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null; role: string | null };
    onRegister?: (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    onAnonomusLogin ?: () => Promise<any>;
  }

export  interface JWTPayload {
    exp: number;
    iat: number;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    userId?: string;
  }