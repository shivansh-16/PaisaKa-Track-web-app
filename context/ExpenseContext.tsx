'use client';

    import { createContext, useContext, useState, useEffect, useCallback } from 'react';
    import { useAuth } from './AuthContext';
    import { getBrowserSupabase } from '@/lib/db';

    interface Expense {
      id: string;
      user_id: string;
      amount: number;
      category: string;
      title?: string | null;
      description?: string | null;
      occurred_at: string;
      created_at: string;
      type: string;
    }

    interface Group {
      id: string;
      name: string;
      members: string[];
      totalFund: number;
      totalSpent: number;
    }

    interface ExpenseContextType {
      expenses: Expense[];
      groups: Group[];
      addExpense: (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
      deleteExpense: (id: string) => Promise<void>;
      getExpenses: () => Promise<void>;
      getTotalBalance: () => number;
      getMonthlySpending: (month: number, year: number) => number;
      isLoading: boolean;
    }

    const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

    export const useExpenses = () => {
      const context = useContext(ExpenseContext);
      if (!context) {
        throw new Error('useExpenses must be used within a ExpenseProvider');
      }
      return context;
    };

    export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
      const [expenses, setExpenses] = useState<Expense[]>([]);
      const [groups, setGroups] = useState<Group[]>([]);
      const [isLoading, setIsLoading] = useState(false);
      const { user } = useAuth();
      const supabase = getBrowserSupabase();

      const getExpenses = useCallback(async () => {
        if (user) {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('transactions')
              .select(`id,type,amount,title,description:note,occurred_at,created_at,user_id,categories(id,name_en,name_hi)`)
              .eq('user_id', user.id)
              .order('occurred_at', { ascending: false });

            if (error) {
              console.error('Error fetching transactions:', error);
            }

            const updatedExpenses = (data || []).map((item: any) => ({
              id: item.id,
              user_id: item.user_id,
              amount: Math.abs(item.amount),
              category: (() => {
                const c = item.categories;
                const cat = Array.isArray(c) ? c[0] : c;
                return cat ? (cat.name_en || cat.name_hi) : null;
              })(),
              title: item.title || null,
              description: item.description || item.note || null,
              occurred_at: item.occurred_at,
              created_at: item.created_at,
              type: item.type || (item.amount > 0 ? 'income' : 'expense'),
            })) as Expense[];

            setExpenses(updatedExpenses);
          } finally {
            setIsLoading(false);
          }
        }
      }, [supabase, user]);

      useEffect(() => {
        getExpenses();
      }, [getExpenses]);

      // Listen for global event when a transaction is added elsewhere (e.g., via API)
      useEffect(() => {
        const handler = () => { getExpenses(); };
        if (typeof window !== 'undefined') {
          window.addEventListener('paisa_expense_added', handler);
        }
        return () => { if (typeof window !== 'undefined') { window.removeEventListener('paisa_expense_added', handler); } };
      }, [getExpenses]);

      const addExpense = async (expenseData: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
        if (user) {
          setIsLoading(true);
          try {
            const insert = {
              user_id: user.id,
              type: 'expense',
              amount: expenseData.amount,
              currency: 'INR',
              category_id: null,
              payment_method: null,
              note: expenseData.description ?? null,
              occurred_at: expenseData.occurred_at,
              title: expenseData.title ?? null,
            };

            const { data, error } = await supabase
              .from('transactions')
              .insert([insert])
              .select('*')
              .single();

            if (error) {
              console.error('Error adding transaction:', error);
            } else if (data) {
              // refresh list or append
              setExpenses(prev => [
                {
                  id: data.id,
                  user_id: data.user_id,
                  amount: Math.abs(data.amount),
                  category: data.category_id ?? null,
                  title: data.title ?? null,
                  description: data.note ?? null,
                  occurred_at: data.occurred_at,
                  created_at: data.created_at,
                  type: data.type || 'expense',
                },
                ...prev,
              ]);
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      const updateExpense = async (id: string, updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>) => {
        if (user) {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('transactions')
              .update(updates)
              .eq('id', id)
              .select('*');

            if (error) {
              console.error('Error updating expense:', error);
            } else if (data) {
              setExpenses(expenses.map(expense => (expense.id === id ? data[0] as Expense : expense)));
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      const deleteExpense = async (id: string) => {
        if (user) {
          setIsLoading(true);
          try {
            const { error } = await supabase
              .from('transactions')
              .delete()
              .eq('id', id);

            if (error) {
              console.error('Error deleting expense:', error);
            } else {
              setExpenses(expenses.filter(expense => expense.id !== id));
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      const getTotalBalance = () => {
        let totalIncome = 0;
        let totalExpense = 0;

        expenses.forEach(item => {
          if (item.type === 'income') {
            totalIncome += item.amount;
          } else {
            totalExpense += item.amount;
          }
        });

        return totalIncome - totalExpense;
      };

      const getMonthlySpending = (month: number, year: number) => {
        let monthlySpending = 0;

        expenses.forEach(expense => {
          const expenseDate = new Date(expense.occurred_at);
          if (expenseDate.getMonth() === month && expenseDate.getFullYear() === year && expense.type === 'expense') {
            monthlySpending += expense.amount;
          }
        });

        return monthlySpending;
      };

      const value: ExpenseContextType = {
        expenses,
        groups,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenses,
        getTotalBalance,
        getMonthlySpending,
        isLoading,
      };

      return (
        <ExpenseContext.Provider value={value}>
          {children}
        </ExpenseContext.Provider>
      );
    };
