import { createContext, useContext, useEffect, useState } from "react";
import * as base64 from "base-64";
import * as SecureStore from "expo-secure-store";
import { AuthProps } from "@/utils/interface";
import axiosInstance from "@/utils/config";
import { useRouter, useSegments } from "expo-router";
import { Platform } from "react-native";

// Constants
const Token_key = "my-jwt";

// Types
interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  role: string | null;
  justLoggedIn?: boolean;
}

interface AuthContextType extends AuthProps {
  authState?: AuthState;
  onRegister?: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isStudent: boolean
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<void>;
  onAnonymousLogin?: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({});

// Hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Helper function to get route based on role
export const getHomeRouteByRole = (role: string | null): string => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/(adminroot)/(tabs)/home";
    case "student":
      return "/(studentroot)/(tabs)/home";
    case "sponsor":
    default:
      return "/(root)/(tabs)/home";
  }
};

// JWT Token handling functions
const decodeJWTPayload = (token: string) => {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Get the payload (middle part)
    const payload = parts[1];

    // Handle padding
    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "="
    );

    // Decode based on platform
    let decodedPayload;
    if (Platform.OS === "android") {
      // For Android: manually decode base64url to JSON
      const encodedPayload = paddedPayload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const decodedString = base64.decode(encodedPayload);
      decodedPayload = JSON.parse(decodedString);
    } else {
      // For iOS: standard atob decoding works fine
      const decodedString = atob(paddedPayload);
      decodedPayload = JSON.parse(decodedString);
    }

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw new Error("Failed to decode JWT payload");
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWTPayload(token);
    if (!decoded?.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Main AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
    role: null,
    justLoggedIn: false,
  });

  const router = useRouter();
  const segments = useSegments();

  // Simplified navigation effect
  useEffect(() => {
    if (isLoading) return;

    const firstSegment = segments[0];
    const currentRoute = segments[2];

    // Protected routes that require authentication
    const protectedRoutes = ["donate", "profile", "students"];

    if (authState.authenticated && authState.justLoggedIn) {
      // Only redirect right after login
      const homeRoute = getHomeRouteByRole(authState.role);
      router.replace(homeRoute as any);
      // Reset the justLoggedIn flag
      setAuthState((prev) => ({ ...prev, justLoggedIn: false }));
    } else if (
      !authState.authenticated &&
      currentRoute &&
      protectedRoutes.includes(currentRoute)
    ) {
      // Only redirect from protected routes when not authenticated
      router.replace("/(root)/(tabs)/home" as any);
    }
  }, [authState.authenticated, authState.role, isLoading, segments]);

  // Axios interceptors setup
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync(Token_key);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync(Token_key);
          delete axiosInstance.defaults.headers.common["Authorization"];
          setAuthState({
            token: null,
            authenticated: false,
            role: null,
            justLoggedIn: false,
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Initial token load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(Token_key);
        console.log(
          "Loading token from storage:",
          token ? "Token exists" : "No token"
        );

        if (token && !isTokenExpired(token)) {
          const decodedPayload = decodeJWTPayload(token);
          const role =
            decodedPayload?.[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          setAuthState({
            token,
            authenticated: true,
            role,
            justLoggedIn: false,
          });
        } else {
          if (token) {
            console.log("Token expired, removing from storage");
            await SecureStore.deleteItemAsync(Token_key);
            delete axiosInstance.defaults.headers.common["Authorization"];
          }

          setAuthState({
            token: null,
            authenticated: false,
            role: null,
            justLoggedIn: false,
          });
        }
      } catch (error) {
        console.error("Error in loadToken:", error);
        setAuthState({
          token: null,
          authenticated: false,
          role: null,
          justLoggedIn: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Authentication methods
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isStudent: boolean
  ) => {
    try {
      console.log("Registering user:", {
        firstName,
        lastName,
        email,
        isStudent,
      });

      const results = await axiosInstance.post(`/api/Account/register`, {
        firstName,
        lastName,
        email,
        password,
        isStudent,
      });

      const { token } = results.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      const payload = decodeJWTPayload(token);
      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      await SecureStore.setItemAsync(Token_key, token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setAuthState({
        token,
        authenticated: true,
        role,
        justLoggedIn: true,
      });

      return results;
    } catch (e) {
      console.error("Registration error:", e);
      throw e;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const response = await axiosInstance.post(`/api/Account/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      const payload = decodeJWTPayload(token);
      console.log(payload);
      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      await SecureStore.setItemAsync(Token_key, token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      setAuthState({
        token,
        authenticated: true,
        role,
        justLoggedIn: true,
      });

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return {
        error: true,
        msg: (error as any).response?.data?.msg || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(Token_key);
      delete axiosInstance.defaults.headers.common["Authorization"];

      setAuthState({
        token: null,
        authenticated: false,
        role: null,
        justLoggedIn: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setAuthState({
        token: null,
        authenticated: false,
        role: null,
        justLoggedIn: false,
      });
    }

    router.replace("/(root)/(tabs)/home" as any);
  };

  const anonymousLogin = async () => {
    console.log("Setting anonymous login state");
    setAuthState({
      token: null,
      authenticated: false,
      role: null,
      justLoggedIn: false,
    });
  };

  if (isLoading) {
    return null;
  }

  const value: AuthContextType = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onAnonymousLogin: anonymousLogin,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
