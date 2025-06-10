import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => useContext(AuthContext);
export const useAuthToken = () => {
  const { token, isLoading } = useContext(AuthContext);
  return { token, isLoading };
};