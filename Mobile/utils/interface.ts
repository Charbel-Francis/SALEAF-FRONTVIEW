 export interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
  }