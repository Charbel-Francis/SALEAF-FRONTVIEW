import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthProps } from "@/utils/interface";
import axiosInstance from "@/utils/config";

const Token_key = "my-jwt";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(Token_key);
      console.log("stored:", token);
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      console.log(firstName, lastName, email, password);
      const results = await axiosInstance.post(`/api/Account/register`, {
        firstName,
        lastName,
        email,
        password,
      });
      console.log("account created", results);
      setAuthState({
        token: results.data.token,
        authenticated: true,
      });
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${results.data.token}`;
      await SecureStore.setItemAsync(Token_key, results.data.token);
      return results;
    } catch (e) {
      console.log(e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const results = await axiosInstance.post(`/api/Account/login`, {
        email,
        password,
      });
      console.log("Authenticated:", results);
      setAuthState({
        token: results.data.token,
        authenticated: true,
      });
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${results.data.token}`;

      await SecureStore.setItemAsync(Token_key, results.data.token);
      return results;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(Token_key);
    axiosInstance.defaults.headers.common["Authorization"] = "";
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
