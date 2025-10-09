'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getBrowserSupabase } from '@/lib/db';

interface User {
  id: string;
  email: string | null;
  name?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { name?: string; email: string; phone?: string; password: string }) => Promise<{ ok: boolean; needsVerification?: boolean; error?: string; code?: string }>;
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
        const u = data.user;
        setUser({
          id: u.id,
          email: u.email || null,
          name: (u.user_metadata as any)?.name || undefined,
          phone: (u as any)?.phone || undefined,
          avatar: (u.user_metadata as any)?.avatar || undefined,
          createdAt: new Date(u.created_at),
        });
      }
      setIsLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email || null,
          name: (u.user_metadata as any)?.name || undefined,
          phone: (u as any)?.phone || undefined,
          avatar: (u.user_metadata as any)?.avatar || undefined,
          createdAt: new Date(u.created_at),
        });
      } else {
        setUser(null);
      }
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: 'login' }),
      });
      const data = await response.json();
      
      if (!response.ok || data.error) {
        console.error('Login failed:', data.error);
        return false;
      }

      // Set session in browser Supabase client
      if (data.session) {
        const supabase = getBrowserSupabase();
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
      }

      // Update user state
      if (data.user) {
        const u = data.user;
        setUser({
          id: u.id,
          email: u.email,
          name: (u.user_metadata as any)?.name || undefined,
          phone: (u as any)?.phone || undefined,
          avatar: (u.user_metadata as any)?.avatar || undefined,
          createdAt: new Date(u.created_at),
        });
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { 
    name?: string; 
    email: string; 
    phone?: string; 
    password: string 
  }): Promise<{ ok: boolean; needsVerification?: boolean; error?: string; code?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, type: 'signup' }),
      });

      const json = await response.json();
      if (!response.ok) {
        // return structured failure so UI can show friendly messages without try/catch
        return { ok: false, error: json?.error || 'Signup failed', code: json?.code };
      }

      // Set session in browser Supabase client if provided
      if (json.session) {
        const supabase = getBrowserSupabase();
        await supabase.auth.setSession({
          access_token: json.session.access_token,
          refresh_token: json.session.refresh_token
        });
      }

      // Update user state
      if (json.user) {
        const u = json.user;
        setUser({
          id: u.id,
          email: u.email,
          name: (u.user_metadata as any)?.name || undefined,
          phone: (u as any)?.phone || undefined,
          avatar: (u.user_metadata as any)?.avatar || undefined,
          createdAt: new Date(u.created_at),
        });
      }

      // normalize server response to expected shape
      return { ok: true, needsVerification: !!json.needsVerification };
    } catch (error) {
      console.error('Signup error:', error);
      return { ok: false, error: (error as any)?.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    const supabase = getBrowserSupabase();
    try {
      // currently we only support updating the name in auth.user_metadata
      const name = userData.name;
      if (typeof name !== 'string') return false;

      const { data, error } = await supabase.auth.updateUser({ data: { user_metadata: { name } } });
      if (error) {
        console.error('[AuthContext] updateProfile error:', error);
        return false;
      }

      // update local user state from returned user
      const u = (data as any)?.user;
      if (u) {
        setUser((prev) => ({
          id: u.id,
          email: u.email || null,
          name: (u.user_metadata as any)?.name || undefined,
          phone: (u as any)?.phone || undefined,
          avatar: (u.user_metadata as any)?.avatar || undefined,
          createdAt: new Date(u.created_at),
        }));
      }

      return true;
    } catch (err) {
      console.error('[AuthContext] updateProfile unexpected error:', err);
      return false;
    }
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
