import { skipToken } from '@reduxjs/toolkit/query/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrentUserQuery, useLoginMutation, useLogoutMutation, useRegisterMutation } from './api';
import { logout as logoutAction, setAuthUser, setCurrentUser, setError } from './authSlice';
import type { RootState } from './store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  // Get auth state from Redux (persisted by redux-persist)
  const authUser = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.access_token);
  const refreshToken = useSelector((state: RootState) => state.auth.refresh_token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Only fetch current user if we have a token but no user in Redux state
  const shouldFetchUser = isAuthenticated && !authUser;
  const { data: fetchedUser, isLoading, error } = useGetCurrentUserQuery(shouldFetchUser ? undefined : skipToken);

  // Sync fetched user to Redux state
  useEffect(() => {
    if (fetchedUser) {
      // Handle new backend response format: { message, statusCode, data }
      const userData = fetchedUser.data || fetchedUser;
      dispatch(setCurrentUser(userData));
    }
  }, [fetchedUser, dispatch]);

  // Clear auth state if token is missing but user is still in state
  useEffect(() => {
    if (!accessToken && isAuthenticated) {
      dispatch(logoutAction());
    }
  }, [accessToken, isAuthenticated, dispatch]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      // Handle new backend response format: { message, statusCode, data }
      const authData = result.data || result;
      dispatch(setAuthUser(authData));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.data?.message || err.data?.data?.message || err.message || 'Login failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    organization_id: string;
    department_id?: string;
  }) => {
    try {
      await registerMutation(data).unwrap();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Registration failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      if (refreshToken && authUser?.id) {
        await logoutMutation({ user_id: authUser.id, refresh_token: refreshToken }).unwrap();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(logoutAction());
    }
  };

  return {
    user: authUser,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
