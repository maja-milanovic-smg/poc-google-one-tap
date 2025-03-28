import { reactive, readonly } from 'vue';
import type { AuthState, GoogleUser } from '../types/auth';

const state = reactive<AuthState>({
  isAuthenticated: false,
  user: null
});

export function useAuthStore() {
  const login = (user: GoogleUser) => {
    state.isAuthenticated = true;
    state.user = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
  };

  const logout = () => {
    state.isAuthenticated = false;
    state.user = null;
    localStorage.removeItem('auth_user');
  };

  const initAuth = () => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as GoogleUser;
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (user.exp > currentTime) {
          state.isAuthenticated = true;
          state.user = user;
        } else {
          logout(); // Token expired
        }
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        logout();
      }
    }
  };

  return {
    state: readonly(state),
    login,
    logout,
    initAuth
  };
}

// Create a singleton instance of the store
export const authStore = useAuthStore(); 