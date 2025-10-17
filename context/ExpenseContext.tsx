'use client';

    import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
    import { useAuth } from './AuthContext';
    import { useLanguage } from './LanguageContext';

    export interface Expense {
      id: string;
      userId: string;
      amount: number;
      category: string;
      description?: string;
      date: Date;
      photoUrl?: string;
      groupId?: string;
      isGroupExpense: boolean;
      paidBy?: string;
      participants?: string[];
      splitAmount?: number;
      createdAt: Date;
      updatedAt: Date;
      title?: string;
      occurred_at: string;
    }

    export interface Group {
      id: string;
      name: string;
      description?: string;
      members: GroupMember[];
      totalFund: number;
      totalSpent: number;
      createdBy: string;
      createdAt: Date;
      updatedAt: Date;
    }

    export interface GroupMember {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'member';
      contribution: number;
      balance: number;
    }

    export interface Split {
      id: string;
      expenseId: string;
      fromUserId: string;
      toUserId: string;
      amount: number;
      status: 'pending' | 'paid' | 'cancelled';
      createdAt: Date;
      updatedAt: Date;
    }

    interface ExpenseContextType {
      expenses: Expense[];
      groups: Group[];
      splits: Split[];
      isLoading: boolean;

      // Expense operations
      addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
      updateExpense: (id: string, updates: Partial<Expense>) => Promise<boolean>;
      deleteExpense: (id: string) => Promise<boolean>;
      getExpensesByDateRange: (startDate: Date, endDate: Date) => Expense[];
      getExpensesByCategory: (category: string) => Expense[];

      // Group operations
      createGroup: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
      updateGroup: (id: string, updates: Partial<Group>) => Promise<boolean>;
      deleteGroup: (id: string) => Promise<boolean>;
      addGroupMember: (groupId: string, member: Omit<GroupMember, 'id'>) => Promise<boolean>;
      removeGroupMember: (groupId: string, memberId: string) => Promise<boolean>;

      // Split operations
      createSplit: (split: Omit<Split, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
      updateSplitStatus: (id: string, status: Split['status']) => Promise<boolean>;
      calculateSplit: (amount: number, participants: string[], excludeParticipants?: string[]) => { [userId: string]: number };

      // Analytics
      getTotalBalance: () => number;
      getMonthlySpending: (month: number, year: number) => number;
      getCategoryBreakdown: (month: number, year: number) => { [category: string]: number };
      getGroupBalance: (groupId: string) => number;
    }

    const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

    export function ExpenseProvider({ children }: { children: ReactNode }) {
      const { user } = useAuth();
      const { lang } = useLanguage();
      const [expenses, setExpenses] = useState<Expense[]>([]);
      const [groups, setGroups] = useState<Group[]>([]);
      const [splits, setSplits] = useState<Split[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        // Initial load
        hydrateFromCache();
      }, []);

      useEffect(() => {
        const handler = () => void fetchExpensesFromApi();
        window.addEventListener('expenses-changed', handler);
        return () => window.removeEventListener('expenses-changed', handler);
      }, [user]);

      useEffect(() => {
        if (!user) { setIsLoading(false); return; }
        fetchExpensesFromApi();
        fetchGroupsFromApi();
      }, [user]);

      async function fetchExpensesFromApi() {
        try {
          if (!user) return;
          setIsLoading(true);
          // include access token from browser supabase client
          const { getBrowserSupabase } = await import('@/lib/db');
          const supabase = getBrowserSupabase();
          const session = await supabase.auth.getSession();
          const token = session?.data?.session?.access_token;
          const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch('/api/expenses', { cache: 'no-store', headers });
          if (!res.ok) throw new Error('Failed to fetch expenses');
          const data = await res.json();
          const items = (data.items || []).map((t: any) => ({
            id: String(t.id),
            userId: user.id,
            amount: t.type === 'expense' ? -Number(t.amount) : Number(t.amount),
            category: lang === 'hi' && t.categories?.name_hi ?
              t.categories.name_hi :
              (t.categories?.name_en || String(t.category_id ?? 'Misc')),
            description: t.note ?? undefined,
            date: new Date(t.occurred_at),
            isGroupExpense: false,
            createdAt: new Date(t.created_at || t.occurred_at),
            updatedAt: new Date(t.created_at || t.occurred_at),
            title: t.title,
            occurred_at: t.occurred_at,
          } as Expense));
          setExpenses(items);
          localStorage.setItem('paisaka_expenses', JSON.stringify(items));
        } catch (e) {
          // fallback to cache already loaded
        } finally {
          setIsLoading(false);
        }
      }

      async function fetchGroupsFromApi() {
        try {
          if (!user) return;
          const { getBrowserSupabase } = await import('@/lib/db');
          const supabase = getBrowserSupabase();
          const session = await supabase.auth.getSession();
          const token = session?.data?.session?.access_token;
          const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
          const res = await fetch('/api/groups', { cache: 'no-store', headers });
          if (!res.ok) throw new Error('Failed to fetch groups');
          const data = await res.json();
          const list = (data.items || []).map((g: any) => ({
            id: String(g.id),
            name: String(g.name),
            description: g.description ?? undefined,
            members: [],
            totalFund: 0,
            totalSpent: 0,
            createdBy: '',
            createdAt: new Date(g.created_at),
            updatedAt: new Date(g.created_at),
          } as Group));
          setGroups(list);
          localStorage.setItem('paisaka_groups', JSON.stringify(list));
        } catch (e) {
          // ignore
        }
      }

      const hydrateFromCache = () => {
        try {
          const savedExpenses = localStorage.getItem('paisaka_expenses');
          const savedGroups = localStorage.getItem('paisaka_groups');
          const savedSplits = localStorage.getItem('paisaka_splits');

          if (savedExpenses) {
            const parsedExpenses = JSON.parse(savedExpenses).map((exp: any) => ({
              ...exp,
              date: new Date(exp.date),
              createdAt: new Date(exp.createdAt),
              updatedAt: new Date(exp.updatedAt),
            }));
            setExpenses(parsedExpenses);
          }

          if (savedGroups) {
            const parsedGroups = JSON.parse(savedGroups).map((group: any) => ({
              ...group,
              createdAt: new Date(group.createdAt),
              updatedAt: new Date(group.updatedAt),
            }));
            setGroups(parsedGroups);
          }

          if (savedSplits) {
            const parsedSplits = JSON.parse(savedSplits).map((split: any) => ({
              ...split,
              createdAt: new Date(split.createdAt),
              updatedAt: new Date(split.updatedAt),
            }));
            setSplits(parsedSplits);
          }
        } catch {
          // ignore cache errors
        } finally {
          setIsLoading(false);
        }
      };

      const saveData = (newExpenses?: Expense[], newGroups?: Group[], newSplits?: Split[]) => {
        try {
          if (newExpenses) {
            localStorage.setItem('paisaka_expenses', JSON.stringify(newExpenses));
            setExpenses(newExpenses);
          }
          if (newGroups) {
            localStorage.setItem('paisaka_groups', JSON.stringify(newGroups));
            setGroups(newGroups);
          }
          if (newSplits) {
            localStorage.setItem('paisaka_splits', JSON.stringify(newSplits));
            setSplits(newSplits);
          }
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };

      // Expense operations (still local for now; server integration can be added)
      const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
        try {
          const newExpense: Expense = {
            ...expenseData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const updatedExpenses = [...expenses, newExpense];
          saveData(updatedExpenses);
          return true;
        } catch (error) {
          console.error('Error adding expense:', error);
          return false;
        }
      };

      const updateExpense = async (id: string, updates: Partial<Expense>): Promise<boolean> => {
        try {
          const updatedExpenses = expenses.map(expense =>
            expense.id === id
              ? { ...expense, ...updates, updatedAt: new Date() }
              : expense
          );
          saveData(updatedExpenses);
          return true;
        } catch (error) {
          console.error('Error updating expense:', error);
          return false;
        }
      };

      const deleteExpense = async (id: string): Promise<boolean> => {
        try {
          const updatedExpenses = expenses.filter(expense => expense.id !== id);
          saveData(updatedExpenses);
          return true;
        } catch (error) {
          console.error('Error deleting expense:', error);
          return false;
        }
      };

      const getExpensesByDateRange = (startDate: Date, endDate: Date): Expense[] => {
        return expenses.filter(expense =>
          expense.date >= startDate && expense.date <= endDate
        );
      };

      const getExpensesByCategory = (category: string): Expense[] => {
        return expenses.filter(expense => expense.category === category);
      };

      // Group operations (still local)
      const createGroup = async (groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
        try {
          const newGroup: Group = {
            ...groupData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const updatedGroups = [...groups, newGroup];
          saveData(undefined, updatedGroups);
          return true;
        } catch (error) {
          console.error('Error creating group:', error);
          return false;
        }
      };

      const updateGroup = async (id: string, updates: Partial<Group>): Promise<boolean> => {
        try {
          const updatedGroups = groups.map(group =>
            group.id === id
              ? { ...group, ...updates, updatedAt: new Date() }
              : group
          );
          saveData(undefined, updatedGroups);
          return true;
        } catch (error) {
          console.error('Error updating group:', error);
          return false;
        }
      };

      const deleteGroup = async (id: string): Promise<boolean> => {
        try {
          const updatedGroups = groups.filter(group => group.id !== id);
          saveData(undefined, updatedGroups);
          return true;
        } catch (error) {
          console.error('Error deleting group:', error);
          return false;
        }
      };

      const addGroupMember = async (groupId: string, member: Omit<GroupMember, 'id'>): Promise<boolean> => {
        try {
          const newMember: GroupMember = {
            ...member,
            id: Date.now().toString(),
          };

          const updatedGroups = groups.map(group =>
            group.id === groupId
              ? { ...group, members: [...group.members, newMember] }
              : group
          );
          saveData(undefined, updatedGroups);
          return true;
        } catch (error) {
          console.error('Error adding group member:', error);
          return false;
        }
      };

      const removeGroupMember = async (groupId: string, memberId: string): Promise<boolean> => {
        try {
          const updatedGroups = groups.map(group =>
            group.id === groupId
              ? { ...group, members: group.members.filter(member => member.id !== memberId) }
              : group
          );
          saveData(undefined, updatedGroups);
          return true;
        } catch (error) {
          console.error('Error removing group member:', error);
          return false;
        }
      };

      // Split operations
      const createSplit = async (splitData: Omit<Split, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
        try {
          const newSplit: Split = {
            ...splitData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const updatedSplits = [...splits, newSplit];
          saveData(undefined, undefined, updatedSplits);
          return true;
        } catch (error) {
          console.error('Error creating split:', error);
          return false;
        }
      };

      const updateSplitStatus = async (id: string, status: Split['status']): Promise<boolean> => {
        try {
          const updatedSplits = splits.map(split =>
            split.id === id
              ? { ...split, status, updatedAt: new Date() }
              : split
          );
          saveData(undefined, undefined, updatedSplits);
          return true;
        } catch (error) {
          console.error('Error updating split status:', error);
          return false;
        }
      };

      const calculateSplit = (amount: number, participants: string[], excludeParticipants: string[] = []): { [userId: string]: number } => {
        const activeParticipants = participants.filter(p => !excludeParticipants.includes(p));
        const splitAmount = amount / activeParticipants.length;

        const result: { [userId: string]: number } = {};
        activeParticipants.forEach(participant => {
          result[participant] = splitAmount;
        });

        return result;
      };

      // Analytics
      const getTotalBalance = (): number => {
        const totalIncome = expenses
          .filter(expense => expense.amount > 0)
          .reduce((sum, expense) => sum + expense.amount, 0);

        const totalExpenses = expenses
          .filter(expense => expense.amount < 0)
          .reduce((sum, expense) => sum + Math.abs(expense.amount), 0);

        return totalIncome - totalExpenses;
      };

      const getMonthlySpending = (month: number, year: number): number => {
        return expenses
          .filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === month &&
              expenseDate.getFullYear() === year &&
              expense.amount < 0;
          })
          .reduce((sum, expense) => sum + Math.abs(expense.amount), 0);
      };

      const getCategoryBreakdown = (month: number, year: number): { [category: string]: number } => {
        const monthlyExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === month &&
            expenseDate.getFullYear() === year &&
            expense.amount < 0;
        });

        const breakdown: { [category: string]: number } = {};
        monthlyExpenses.forEach(expense => {
          const category = expense.category;
          breakdown[category] = (breakdown[category] || 0) + Math.abs(expense.amount);
        });

        return breakdown;
      };

      const getGroupBalance = (groupId: string): number => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return 0;
        return group.totalFund - group.totalSpent;
      };

      return (
        <ExpenseContext.Provider value={{
          expenses,
          groups,
          splits,
          isLoading,
          addExpense,
          updateExpense,
          deleteExpense,
          getExpensesByDateRange,
          getExpensesByCategory,
          createGroup,
          updateGroup,
          deleteGroup,
          addGroupMember,
          removeGroupMember,
          createSplit,
          updateSplitStatus,
          calculateSplit,
          getTotalBalance,
          getMonthlySpending,
          getCategoryBreakdown,
          getGroupBalance,
        }}>
          {children}
        </ExpenseContext.Provider>
      );
    }

    export function useExpenses() {
      const context = useContext(ExpenseContext);
      if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
      }
      return context;
    }
