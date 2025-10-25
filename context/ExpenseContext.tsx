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
      updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
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
              .from('expenses')
              .select('*')
              .eq('user_id', user.id)
              .order('occurred_at', { ascending: false });

            if (error) {
              console.error('Error fetching expenses:', error);
            }

            // Separate incomes and expenses
            const updatedExpenses = data ? data.map((item: any) => ({
              ...item,
              type: item.amount > 0 ? 'income' : 'expense', // Determine type based on amount
              amount: Math.abs(item.amount) // Store amount as absolute value
            })) : [];

            setExpenses(updatedExpenses);
          } finally {
            setIsLoading(false);
          }
        }
      }, [supabase, user]);

      useEffect(() => {
        getExpenses();
      }, [getExpenses]);

      const addExpense = async (expenseData: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
        if (user) {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('expenses')
              .insert([
                {
                  user_id: user.id,
                  ...expenseData,
                },
              ])
              .select('*');

            if (error) {
              console.error('Error adding expense:', error);
            } else if (data) {
              setExpenses([...expenses, data[0] as Expense]);
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      const updateExpense = async (id: string, updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
        if (user) {
          setIsLoading(true);
          try {
            const { data, error } = await supabase
              .from('expenses')
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
              .from('expenses')
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
