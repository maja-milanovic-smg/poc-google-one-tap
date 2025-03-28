import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAuthStore } from '../authStore';
import type { GoogleUser } from '../../types/auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Set future expiration time to ensure valid token
const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour in the future

// Mock GoogleUser data
const mockUser: GoogleUser = {
  iss: 'https://accounts.google.com',
  nbf: 1617300800,
  aud: 'client-id',
  sub: 'user-id',
  email: 'user@example.com',
  email_verified: true,
  azp: 'client-id',
  name: 'Test User',
  picture: 'https://example.com/profile.jpg',
  given_name: 'Test',
  family_name: 'User',
  iat: 1617300800,
  exp: futureExp, // Set to future time for valid token
  jti: 'token-id'
};

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a fresh store
    vi.resetModules();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Clear mocks
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with unauthenticated state', () => {
    const { state } = useAuthStore();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
  });

  it('should login user and update state', () => {
    const { state, login } = useAuthStore();
    login(mockUser);
    
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'auth_user',
      JSON.stringify(mockUser)
    );
  });

  it('should logout user and clear state', () => {
    const { state, login, logout } = useAuthStore();
    
    // First login
    login(mockUser);
    expect(state.isAuthenticated).toBe(true);
    
    // Then logout
    logout();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
  });

  it('should initialize auth from valid localStorage data', () => {
    // Setup valid user JSON string
    const userJson = JSON.stringify(mockUser);
    localStorageMock.getItem.mockReturnValueOnce(userJson);
    
    // Create a new store instance to test initialization
    const { state, initAuth } = useAuthStore();
    initAuth();
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_user');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it('should handle expired token during initialization', () => {
    // Create an expired token (exp in the past)
    const expiredUser = {
      ...mockUser,
      exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour in the past
    };
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(expiredUser));
    
    const { state, initAuth } = useAuthStore();
    initAuth();
    
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
  });
}); 