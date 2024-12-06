import { useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface ApiState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const router = useRouter();

  const request = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'delete',
      url: string,
      data?: any
    ) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await apiClient[method](url, data);
        setState((prev) => ({ ...prev, data: response.data, loading: false }));

        if (options.onSuccess) {
          options.onSuccess(response.data);
        }

        if (options.redirectTo) {
          router.push(options.redirectTo);
        }

        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message;
        const apiError = new Error(errorMessage);

        setState((prev) => ({
          ...prev,
          error: apiError,
          loading: false,
        }));

        if (options.onError) {
          options.onError(apiError);
        }

        throw apiError;
      }
    },
    [options, router]
  );

  const get = useCallback(
    (url: string) => request('get', url),
    [request]
  );

  const post = useCallback(
    (url: string, data: any) => request('post', url, data),
    [request]
  );

  const put = useCallback(
    (url: string, data: any) => request('put', url, data),
    [request]
  );

  const del = useCallback(
    (url: string) => request('delete', url),
    [request]
  );

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
  };
}
