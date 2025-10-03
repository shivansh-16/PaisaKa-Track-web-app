'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getBrowserSupabase } from '@/lib/db';

interface User {
  id: string;
  email: string | null;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { name?: string; email: string; phone?: string; password: string }) => Promise<{ ok: boolean; needsVerification?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser({ id: data.user.id, email: data.user.email, createdAt: new Date(data.user.created_at) });
      }
      setIsLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email, createdAt: new Date(session.user.created_at) });
      } else {
        setUser(null);
      }
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return false;
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { name?: string; email: string; phone?: string; password: string }): Promise<{ ok: boolean; needsVerification?: boolean }> => {
    setIsLoading(true);
    try {
      const supabase = getBrowserSupabase();
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: { data: { full_name: userData.name } },
      });
      if (error) return { ok: false };
      // Create profile row (idempotent via RLS/trigger or API)
      if (data.user) {
        try {
          await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.user.id, full_name: userData.name }),
          });
        } catch {}
      }
      const hasSession = !!data.session;
      return hasSession ? { ok: true } : { ok: true, needsVerification: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
  };

  const updateProfile = async (_userData: Partial<User>): Promise<boolean> => {
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
