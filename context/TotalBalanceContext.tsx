'use client';

    import { createContext, useContext, useState, useEffect } from 'react';
    import { useAuth } from './AuthContext';
    import { useExpenses, Expense } from './ExpenseContext';
    import { useIncomes, Income } from './IncomeContext';

    interface TotalBalanceContextType {
      totalBalance: number;
      isLoading: boolean;
    }

    const TotalBalanceContext = createContext<TotalBalanceContextType | undefined>(undefined);

    export const useTotalBalance = () => {
      const context = useContext(TotalBalanceContext);
      if (!context) {
        throw new Error('useTotalBalance must be used within a TotalBalanceProvider');
      }
      return context;
    };

    export const TotalBalanceProvider = ({ children }: { children: React.ReactNode }) => {
      const [totalBalance, setTotalBalance] = useState<number>(0);
      const [isLoading, setIsLoading] = useState(false);
      const { user } = useAuth();
      const { expenses } = useExpenses();
      const { incomes } = useIncomes();

      useEffect(() => {
        const calculateTotalBalance = () => {
          setIsLoading(true);
          try {
            let totalIncome = 0;
            let totalExpense = 0;

            if (incomes && incomes.length > 0) {
              incomes.forEach((income: Income) => {
                totalIncome += income.amount;
              });
            }

            if (expenses && expenses.length > 0) {
              expenses.forEach((expense: Expense) => {
                if (expense.type === 'expense') {
                  totalExpense += expense.amount;
                }
              });
            }

            setTotalBalance(totalIncome - totalExpense);
          } finally {
            setIsLoading(false);
          }
        };

        calculateTotalBalance();
      }, [user, expenses, incomes]);

      const value: TotalBalanceContextType = {
        totalBalance,
        isLoading,
      };

      return (
        <TotalBalanceContext.Provider value={value}>
          {children}
        </TotalBalanceContext.Provider>
      );
    };
