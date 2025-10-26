"use client";

import { useMemo, useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

function formatCurrency(v: number) {
  return `₹${v.toLocaleString('en-IN')}`;
}

function smallSum(items: any[], predicate: (t: any) => boolean) {
  return items.filter(predicate).reduce((s, t) => s + Number(t.amount || 0), 0);
}

function Sparkline({ points }: { points: number[] }) {
  const width = 300;
  const height = 48;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const step = width / Math.max(points.length - 1, 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - ((p - min) / (max - min || 1)) * height}`).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden>
      <path d={path} fill="none" stroke="#f97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Analytics() {
  const { expenses } = useExpenses();
  const { T, lang } = useLanguage();
  const { user } = useAuth();
  const [period, setPeriod] = useState<'30d'|'90d'|'1y'|'all'>('30d');

  // aggregate data
  const stats = useMemo(() => {
    const now = Date.now();
    const ms = period === '30d' ? 30*24*60*60*1000 : period === '90d' ? 90*24*60*60*1000 : period === '1y' ? 365*24*60*60*1000 : Infinity;
  const filtered = expenses.filter(e => (now - new Date(e.occurred_at).getTime()) <= ms);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount || 0), 0);
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Math.abs(t.amount || 0), 0);
    const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;
    const byCategory: Record<string, number> = {};
    filtered.forEach(e => { const cat = e.category || 'Misc'; byCategory[cat] = (byCategory[cat] || 0) + Math.abs(e.amount); });
    const top = [...filtered].sort((a,b) => Math.abs(b.amount) - Math.abs(a.amount)).slice(0,5);
    const spark = Array.from({length:12}).map((_,i) => {
      // naive monthly slice for sparkline
      const slice = filtered.filter((f) => {
        const d = new Date(f.occurred_at);
        return d.getMonth() === ((new Date()).getMonth() - (11 - i) + 12) % 12;
      });
      return slice.reduce((s, t) => s + Math.abs(t.amount), 0);
    });
    return { filtered, totalExpense, totalIncome, savingsRate, byCategory, top, spark };
  }, [expenses, period]);

  const categories = Object.entries(stats.byCategory).sort((a,b) => b[1]-a[1]);

  const downloadCSV = () => {
    const rows: string[][] = [['date','amount','category','description']].concat(
      expenses.map(e => [
        new Date(e.occurred_at).toLocaleDateString('en-IN'),
        String(e.amount),
        String(e.category || ''),
        String(e.description || '')
      ])
    );
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'paisaka-analytics.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      <header className="flex items-center justify-between mb-6">
        <a href="/" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>←</a>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>{T('analytics.title')}</h1>
          <div className="text-sm text-slate-500">{user?.name ?? user?.email}</div>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value as any)} className="p-2 rounded border" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
            <option value="30d">30d</option>
            <option value="90d">90d</option>
            <option value="1y">1y</option>
            <option value="all">All</option>
          </select>
          <button onClick={downloadCSV} className="pk-button-secondary">{T('analytics.download')}</button>
        </div>
      </header>

      <main className="space-y-6">
        {/* Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="pk-card">
            <div className="text-sm text-slate-500">{lang==='hi' ? 'कुल खर्च' : 'Total Spent'}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--pk-red)' }}>{formatCurrency(stats.totalExpense)}</div>
          </div>
          <div className="pk-card">
            <div className="text-sm text-slate-500">{lang==='hi' ? 'कुल आय' : 'Total Income'}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--pk-green)' }}>{formatCurrency(stats.totalIncome)}</div>
          </div>
          <div className="pk-card">
            <div className="text-sm text-slate-500">{lang==='hi' ? 'बचत दर' : 'Savings Rate'}</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--pk-blue)' }}>{Math.round(stats.savingsRate)}%</div>
          </div>
        </section>

        {/* Trends + Sparkline */}
        <section className="pk-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="pk-section-title">{T('analytics.trends')}</h2>
            <div className="text-sm text-slate-500">{T('analytics.period')}: {period}</div>
          </div>
          <div>
            <Sparkline points={stats.spark} />
          </div>
        </section>

        {/* Category breakdown & Top spends */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="pk-card md:col-span-2">
            <h3 className="pk-section-title mb-3">{T('analytics.categoryBreakdown')}</h3>
            {categories.length === 0 ? <div className="text-sm text-slate-500">{T('analytics.noData')}</div> : (
              <ul className="space-y-2">
                {categories.map(([cat, val]) => (
                  <li key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--pk-card)' }}>{cat[0]}</div>
                      <div>{cat}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: 'var(--pk-text-primary)' }}>{formatCurrency(val)}</div>
                      <div className="text-sm text-slate-500">{Math.round((val / (stats.totalExpense || 1)) * 100)}%</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pk-card">
            <h3 className="pk-section-title mb-3">{T('analytics.topSpends')}</h3>
            {stats.top.length === 0 ? <div className="text-sm text-slate-500">{T('analytics.noData')}</div> : (
              <ol className="list-decimal pl-5 space-y-2">
                {stats.top.map((t:any) => (
                  <li key={t.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.category}</div>
                      <div className="text-sm text-slate-500">{t.description || ''}</div>
                    </div>
                    <div className="font-bold" style={{ color: 'var(--pk-text-primary)' }}>{formatCurrency(Math.abs(t.amount))}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        {/* Group summary placeholder */}
        <section className="pk-card">
          <h3 className="pk-section-title mb-3">{T('analytics.title')}</h3>
          <div className="text-sm text-slate-500">{T('analytics.groupPlaceholder')}</div>
        </section>

      </main>
    </div>
  );
}
