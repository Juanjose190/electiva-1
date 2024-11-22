import { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = async (username: string, password: string) => {
    try {
      // Cambié la ruta aquí de '/auth/login' a '/users/login'
      const response = await api.post('/users/login', { username, password }); 
      
      const { token } = response.data;  // Asegúrate de que el backend devuelve el token
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      toast.success('Welcome to the system!');
      return true;
    } catch (error) {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
