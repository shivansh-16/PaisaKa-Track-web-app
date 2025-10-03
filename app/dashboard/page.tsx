'use client';

import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useExpenses } from '@/context/ExpenseContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import RealtimeSubscriber from '@/components/RealtimeSubscriber';
import Protected from '@/components/Protected';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { expenses, groups, getTotalBalance, getMonthlySpending, isLoading: expenseLoading } = useExpenses();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
  }, [user, authLoading, router]);

  if (!user) {
    return null;
  }
    const totalBalance = getTotalBalance();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpending = getMonthlySpending(currentMonth, currentYear);
    const recentExpenses = expenses
        .filter(expense => expense.amount < 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);
    return (
        <Protected>
        <div className="min-h-screen" style={{ background: 'var(--pk-bg)' }}>
            <RealtimeSubscriber />
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: 'var(--pk-orange)' }}>
                        ₹
                    </div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>PaisaKa Track</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        aria-label="Notifications"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        🔔
                    </button>
                    <a
                        href="/profile"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <User />
                    </a>
                </div>
            </header>

            <main className="px-4 py-6 space-y-6">
                {/* Total Balance Card */}
                <section className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--pk-orange) 0%, #ff6b35 100%)' }}>
                    <div className="relative z-10">
                        <div className="text-sm opacity-90 mb-2">Total Balance</div>
                        <div className="text-4xl font-bold mb-2">₹{Math.abs(totalBalance).toLocaleString()}</div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1">
                                <span>{totalBalance >= 0 ? <Image src="/trendline.svg" width={20} height={20} alt="trendline" /> : '↘️'}</span>
                                <span>{totalBalance >= 0 ? '+' : '-'}₹{Math.abs(monthlySpending)} this month</span>
                            </span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                        <div className="w-full h-full rounded-full" style={{ background: 'white' }}></div>
                    </div>
                </section>

                {/* Quick Action Buttons */}
                <section className="grid grid-cols-2 gap-4">
                    <a href="/expenses/add" className="pk-button-primary h-20 flex flex-col items-center justify-center gap-2">
                        <div className="text-2xl"><Image src="/add.svg" width={20} height={20} alt="Add Expense" /></div>
                        <div className="text-sm font-medium">Add Expense</div>
                    </a>
                    <button className="h-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2" style={{ borderColor: 'var(--pk-orange)', background: 'white' }}>
                        <div className="text-2xl"><Image src="/mic.svg" width={20} height={20} alt="Voice Add" /></div>
                        <div className="text-sm font-medium" style={{ color: 'var(--pk-orange)' }}>Voice Add</div>
                    </button>
                </section>

                {/* Recent Expenses */}
                <section className="pk-card">
                    <h2 className="pk-section-title mb-4">Recent Expenses</h2>
                    <div className="space-y-4">
                        {recentExpenses.length > 0 ? (
                            recentExpenses.map((expense) => {
                                const categoryEmojis: { [key: string]: string } = {
                                    'Food': '🍕',
                                    'Transport': '🚗',
                                    'Tea': '☕',
                                    'Movies': '🎬',
                                    'Medical': '🏥',
                                    'Shopping': '🛒',
                                    'Clothes': '👕',
                                    'Bills': '💡',
                                    'Education': '🎓',
                                };

                                const emoji = categoryEmojis[expense.category] || '💰';
                                const time = new Date(expense.date).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                });

                                return (
                                    <div key={expense.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--pk-bg)' }}>
                                                {emoji}
                                            </div>
                                            <div>
                                                <div className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>
                                                    {expense.description || expense.category}
                                                </div>
                                                <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>{time}</div>
                                            </div>
                                        </div>
                                        <div className="pk-amount" style={{ color: 'var(--pk-red)' }}>
                                            -₹{Math.abs(expense.amount).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8" style={{ color: 'var(--pk-text-secondary)' }}>
                                <div className="text-4xl mb-2">📝</div>
                                <p>No expenses yet</p>
                                <p className="text-sm">Add your first expense to get started!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Active Groups */}
                <section className="pk-card">
                    <h2 className="pk-section-title mb-4">Active Groups</h2>
                    <div className="space-y-3">
                        {groups.length > 0 ? (
                            groups.slice(0, 2).map((group) => {
                                const groupEmojis: { [key: string]: string } = {
                                    'Ganesh Festival': '🎉',
                                    'Room Expenses': '🏠',
                                    'Wedding': '💒',
                                    'Trip': '✈️',
                                    'Office': '🏢',
                                };

                                const emoji = groupEmojis[group.name] || '👥';
                                const remainingBalance = group.totalFund - group.totalSpent;

                                return (
                                    <div key={group.id} className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: 'var(--pk-bg)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--pk-orange)' }}>
                                                {emoji}
                                            </div>
                                            <div>
                                                <div className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>{group.name}</div>
                                                <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>
                                                    {group.members.length} members
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="pk-amount" style={{ color: 'var(--pk-green)' }}>
                                                ₹{remainingBalance.toLocaleString()}
                                            </div>
                                            <div className="text-xs" style={{ color: 'var(--pk-text-secondary)' }}>
                                                remaining
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8" style={{ color: 'var(--pk-text-secondary)' }}>
                                <div className="text-4xl mb-2">👥</div>
                                <p>No groups yet</p>
                                <p className="text-sm">Create or join a group to get started!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

        </div>
        </Protected>
    );
}
