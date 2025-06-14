import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthContextType,
} from '../types/auth';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();

      if (storedUser && storedToken) {
        try {
          // Validate token with server
          const isValid = await authService.validateToken();
          if (isValid) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user: storedUser, token: storedToken },
            });
          } else {
            // Token invalid, try refresh
            await refreshToken();
          }
        } catch (error) {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const authData = await authService.login(credentials);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: authData.user, token: authData.accessToken },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const authData = await authService.register(userData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: authData.user, token: authData.accessToken },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const authData = await authService.refreshToken();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: authData.user, token: authData.accessToken },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_LOGOUT' });
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};