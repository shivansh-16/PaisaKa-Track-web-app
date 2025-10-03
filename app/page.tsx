'use client';


import { useAuth } from '@/context/AuthContext';
import { useExpenses } from '@/context/ExpenseContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: expenseLoading } = useExpenses();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading || expenseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--pk-bg)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--pk-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}

