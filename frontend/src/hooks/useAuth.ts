import React from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setAuth, setUser, clearAuth, token } = useAuthStore();

  // Query to fetch current user
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user in store when query succeeds
  React.useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data, setUser]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      authService.setStoredToken(data.access_token);
      setAuth(data.access_token, null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Login successful!');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Registration failed');
    },
  });

  const logout = () => {
    authService.logout();
    clearAuth();
    queryClient.clear();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}; 