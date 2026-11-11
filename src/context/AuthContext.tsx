// LEVEL UP 73 - Authentication Context
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { storage } from '../services/storageEngine';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabase = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isSupabase && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile && mounted) {
              setUser(profile as UserProfile);
            } else if (mounted) {
              // Fallback to local profile or construct
              const localProfile = storage.getProfile();
              setUser({
                ...localProfile,
                id: session.user.id,
                email: session.user.email || localProfile.email,
              });
            }
          } else if (mounted) {
            // Check local session
            const localUser = storage.getProfile();
            setUser(localUser);
          }

          // Listen for Supabase auth state changes
          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase!
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              if (profile) setUser(profile as UserProfile);
            } else {
              setUser(null);
            }
          });
        } else {
          // Local persistent mode
          const localUser = storage.getProfile();
          setUser(localUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        const localUser = storage.getProfile();
        setUser(localUser);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Subscribe to storage changes for reactive updates to profile/xp/streak
    const unsubscribe = storage.subscribe(() => {
      const updated = storage.getProfile();
      setUser((prev) => (prev ? { ...prev, ...updated } : updated));
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [isSupabase]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabase && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profile) setUser(profile as UserProfile);
        }
        return { success: true };
      } else {
        // Local mode login
        const current = storage.getProfile();
        const updated = storage.updateProfile({
          email,
          last_active_date: new Date().toISOString().split('T')[0],
        });
        setUser(updated);
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password?: string, fullName?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabase && supabase && password) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || 'Rishabh' },
          },
        });
        if (error) throw error;
        return { success: true };
      } else {
        // Local mode sign up
        const updated = storage.updateProfile({
          email,
          full_name: fullName || 'Rishabh',
          last_active_date: new Date().toISOString().split('T')[0],
        });
        setUser(updated);
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Sign up failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabase && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabase && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed' };
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    const updated = storage.updateProfile(updates);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isSupabaseConnected: isSupabase,
        login,
        signUp,
        signOut,
        resetPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

