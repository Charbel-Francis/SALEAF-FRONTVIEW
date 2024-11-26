import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { KeyedObject } from 'types/root';
import { AuthProps, JWTContextType } from 'types/auth';

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const getPayload: (st: string) => KeyedObject = (serviceToken) => {
  if (!serviceToken) {
    return {};
  }
  return jwtDecode(serviceToken);
};

const setSession = (serviceToken?: string | null, refreshToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

const refreshAuthToken = async () => {
  try {
    const serviceToken = localStorage.getItem('serviceToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!serviceToken || !refreshToken) {
      throw new Error('No tokens available');
    }

    const response = await axios.post('/api/Account/refresh-token', {
      token: serviceToken,
      refreshToken: refreshToken
    });

    const { token: newServiceToken, refreshToken: newRefreshToken } = response.data;
    setSession(newServiceToken, newRefreshToken);
    console.log('Token refreshed');
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    setSession(null, null);
    return false;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!serviceToken || !refreshToken) {
          dispatch({ type: LOGOUT });
          return;
        }

        if (verifyToken(serviceToken)) {
          const payload = getPayload(serviceToken);
          console.log('payload - ', payload);
          setSession(serviceToken, refreshToken);
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: payload
            }
          });
        } else if (verifyToken(refreshToken)) {
          const refreshSuccess = await refreshAuthToken();
          if (refreshSuccess) {
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true
              }
            });
          } else {
            dispatch({ type: LOGOUT });
          }
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/account/login', { email, password });
    const { token, refreshToken } = response.data;
    setSession(token, refreshToken);
    const payload = getPayload(token);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: payload
      }
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/Account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { token, refreshToken } = response.data;
    setSession(token, refreshToken);
    const payload = getPayload(token);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: payload
      }
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email: string) => {
    console.log('email - ', email);
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
