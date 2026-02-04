import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { trpcClient } from '../../utils/trpc';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  status: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await storage.getAccessToken();
      const cachedUser = await storage.getUser();
      
      if (token && cachedUser) {
        // Load cached user first for faster UX
        setUser(cachedUser);
        
        // Then try to refresh from backend
        try {
          const result = await trpcClient.auth.getProfile.query({ userId: cachedUser.id });
          if (result.success && result.user) {
            setUser(result.user);
            await storage.setUser(result.user);
          }
        } catch (error) {
          // If refresh fails but we have token and cached user, keep cached user
          console.log('Could not refresh user, using cached data');
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // If token is invalid, clear it
      await storage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(identifier: string, password: string) {
    const result = await trpcClient.auth.login.mutate({ identifier, password });
    
    if (!result.success) {
      throw new Error(result.message || 'Login failed');
    }
    
    // Extract tokens from nested structure
    await storage.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    
    // Set user with all required fields
    const userData: User = {
      ...result.user,
      bio: null, // Not included in login response
      emailVerified: true, // Assuming verified if can login
    };
    
    setUser(userData);
    await storage.setUser(userData);
  }

  async function logout() {
    try {
      if (user) {
        // Try to logout on backend (revoke session)
        await trpcClient.auth.logout.mutate({ userId: user.id });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if backend fails
    }
    await storage.clearTokens();
    setUser(null);
  }

  async function register(email: string, username: string, password: string) {
    await trpcClient.auth.register.mutate({ email, username, password });
    // User needs to verify email before logging in
    // Don't auto-login after registration
  }

  async function refreshUser() {
    try {
      if (user) {
        const result = await trpcClient.auth.getProfile.query({ userId: user.id });
        if (result.success && result.user) {
          setUser(result.user);
          await storage.setUser(result.user);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
