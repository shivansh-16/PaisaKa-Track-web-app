'use client';

    import { createContext, useContext, useState, useEffect, useCallback } from 'react';
    import { useAuth } from './AuthContext';
    import { getBrowserSupabase } from '@/lib/db';

    interface Income {
      id: string;
      user_id: string;
      amount: number;
      category: string;
      title?: string | null;
      description?: string | null;
      occurred_at: string;
      created_at: string;
    }

    interface IncomeContextType {
      incomes: Income[];
      addIncome: (income: Omit<Income, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateIncome: (id: string, updates: Partial<Omit<Income, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
      deleteIncome: (id: string) => Promise<void>;
      getIncomes: () => Promise<void>;
      isLoading: boolean;
    }

    const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

    export const useIncomes = () => {
      const context = useContext(IncomeContext);
      if (!context) {
        throw new Error('useIncomes must be used within a IncomeProvider');
      }
      return context;
    };

    export const IncomeProvider = ({ children }: { children: React.ReactNode }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const supabase = getBrowserSupabase();

      const getIncomes = useCallback(async () => {
        if (user && supabase) {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('incomes')
              .select('*')
              .eq('user_id', user.id)
              .order('occurred_at', { ascending: false });

            if (error) {
              console.error('Error fetching incomes:', error);
            }

            setIncomes(data || []);
          } finally {
            setIsLoading(false);
          }
        }
      }, [supabase, user]);

      useEffect(() => {
        getIncomes();
      }, [getIncomes, supabase, user]);

      // refresh when an income is added via the add page
      useEffect(() => {
        const handler = () => { getIncomes(); };
        if (typeof window !== 'undefined') {
          window.addEventListener('paisa_income_added', handler);
        }
        return () => { if (typeof window !== 'undefined') { window.removeEventListener('paisa_income_added', handler); } };
      }, [getIncomes]);

      const addIncome = async (incomeData: Omit<Income, 'id' | 'user_id' | 'created_at'>) => {
        if (supabase && user) {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('incomes')
              .insert([
                {
                  user_id: user.id,
                  ...incomeData,
                },
              ])
              .select('*');

            if (error) {
              console.error('Error adding income:', error);
            } else if (data) {
              setIncomes([...incomes, data[0] as Income]);
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

  const updateIncome = async (id: string, updates: Partial<Omit<Income, 'id' | 'user_id' | 'created_at'>>) => {
        if (supabase && user) {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('incomes')
              .update(updates)
              .eq('id', id)
              .select('*');

            if (error) {
              console.error('Error updating income:', error);
            } else if (data) {
              setIncomes(incomes.map(income => (income.id === id ? data[0] as Income : income)));
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      const deleteIncome = async (id: string) => {
        if (supabase && user) {
          setIsLoading(true);
          try {
            const { error } = await supabase
              .from('incomes')
              .delete()
              .eq('id', id);

            if (error) {
              console.error('Error deleting income:', error);
            } else {
              setIncomes(incomes.filter(income => income.id !== id));
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      const value: IncomeContextType = {
        incomes,
        addIncome,
        updateIncome,
        deleteIncome,
        getIncomes,
        isLoading,
      };

      return (
        <IncomeContext.Provider value={value}>
          {children}
        </IncomeContext.Provider>
      );
    };
