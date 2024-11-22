import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (
    requestFn: () => Promise<any>,
    successMessage?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestFn();
      if (successMessage) {
        toast.success(successMessage);
      }
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = (url: string) => handleRequest(() => api.get(url));
  
  const post = (url: string, data: any, successMessage?: string) =>
    handleRequest(() => api.post(url, data), successMessage);
  
  const put = (url: string, data: any, successMessage?: string) =>
    handleRequest(() => api.put(url, data), successMessage);
  
  const del = (url: string, successMessage?: string) =>
    handleRequest(() => api.delete(url), successMessage);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del
  };
}