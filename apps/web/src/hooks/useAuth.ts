import { useLogoutMutation } from '@/store/api';
import type { RootState } from '@/store/store';
import { useAppSelector } from '@/store/store';

export function useAuth() {
  const { user, isAuthenticated, refresh_token } = useAppSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    if (!user || !refresh_token) {
      console.error('Cannot logout: user or refresh token missing');
      return;
    }

    try {
      await logout({ user_id: user.id, refresh_token }).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    logout: handleLogout,
  };
}
