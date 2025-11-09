'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AddIncome() {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    paymentMethod: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.amount) {
      setError('Please enter an amount');
      setIsLoading(false);
      return;
    }

    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than zero');
      setIsLoading(false);
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        type: 'income',
        amount: Math.abs(amountValue),
        category: formData.category,
        language: lang,
        title: formData.title || null,
        note: formData.description || null,
        occurred_at: new Date(formData.date).toISOString(),
        payment_method: formData.paymentMethod || null,
      };
      const { getBrowserSupabase } = await import('@/lib/db');
      const supabase = getBrowserSupabase();
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      router.push('/');
    } catch (_err) {
      setError('Failed to add income. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ←
        </Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>आय Add करें</h1>
        <div className="w-10"></div>
      </header>

      <main className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--pk-red)', color: 'white' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <section className="pk-card text-center">
            <div className="text-sm mb-2" style={{ color: 'var(--pk-text-secondary)' }}>Amount (रुपये)</div>
            <div className="text-4xl font-bold pk-rupee flex justify-center items-center ">
              <span>₹</span>
              <input
                type="number"
                name="amount"
                placeholder="100"
                className="text-4xl font-bold text-center border-none outline-none w-1/2 px-2 p-1"
                style={{ background: 'transparent', color: 'var(--pk-text-primary)' }}
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* Category Selection */}
          <section className="pk-card">
            <h2 className="pk-section-title mb-4">
              {lang === 'hi' ? 'श्रेणी चुनें' : 'Select Category'}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { emoji: '💼', name: lang === 'hi' ? 'वेतन' : 'Salary' },
                { emoji: '💻', name: lang === 'hi' ? 'फ्रीलांस' : 'Freelance' },
                { emoji: '💰', name: lang === 'hi' ? 'जेब खर्च' : 'Pocket Money' },
                { emoji: '🏢', name: lang === 'hi' ? 'व्यापार' : 'Business' },
                { emoji: '📈', name: lang === 'hi' ? 'निवेश रिटर्न' : 'Investment Returns' },
                { emoji: '🎁', name: lang === 'hi' ? 'उपहार' : 'Gift' },
                { emoji: '🏠', name: lang === 'hi' ? 'किराया आय' : 'Rental Income' },
                { emoji: '➕', name: lang === 'hi' ? 'अन्य आय' : 'Other Income' },
              ].map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => handleCategorySelect(category.name)}
                  className={`p-4 rounded-lg border text-center ${formData.category === category.name
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                    }`}
                  style={{
                    borderColor: formData.category === category.name ? 'var(--pk-orange)' : 'var(--pk-border)',
                    background: formData.category === category.name ? 'var(--pk-bg)' : 'var(--pk-card)'
                  }}
                >
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--pk-text-primary)' }}>
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Title Field */}
          <section className="pk-card">
            <h2 className="pk-section-title mb-4">Title (Optional)</h2>
            <div className="relative">
              <input
                type="text"
                name="title"
                placeholder="Add title (optional)..."
                className="w-full p-4 pr-12 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Description Field */}
          <section className="pk-card">
            <h2 className="pk-section-title mb-4">📝 बोलिये या लिखिये</h2>
            <div className="relative">
              <input
                type="text"
                name="description"
                placeholder="Add description (optional)..."
                className="w-full p-4 pr-12 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Date Picker */}
          <section className="pk-card">
            <h2 className="pk-section-title mb-4">Date</h2>
            <div className="relative">
              <input
                type="date"
                name="date"
                className="w-full p-4 pr-12 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Payment Method Selector */}
          <section className="pk-card">
            <h2 className="pk-section-title mb-4">Received Via</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { emoji: '🏦', name: lang === 'hi' ? 'बैंक ट्रांसफर' : 'Bank Transfer' },
                { emoji: '📱', name: 'UPI' },
                { emoji: '💵', name: lang === 'hi' ? 'नकद' : 'Cash' },
                { emoji: '🧾', name: lang === 'hi' ? 'चेक' : 'Cheque' },
                { emoji: '💱', name: lang === 'hi' ? 'डिजिटल वॉलेट' : 'Digital Wallet' },
                { emoji: '➕', name: lang === 'hi' ? 'अन्य' : 'Other' },
              ].map((method) => (
                <button
                  key={method.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.name }))}
                  className={`p-4 rounded-lg border text-center ${formData.paymentMethod === method.name
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                    }`}
                  style={{
                    borderColor: formData.paymentMethod === method.name ? 'var(--pk-orange)' : 'var(--pk-border)',
                    background: formData.paymentMethod === method.name ? 'var(--pk-bg)' : 'var(--pk-card)'
                  }}
                >
                  <div className="text-2xl mb-2">{method.emoji}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--pk-text-primary)' }}>
                    {method.name}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Save Button */}
          <section className="pb-6">
            <button
              type="submit"
              className="pk-button-primary w-full text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'SAVING...' : '✅ SAVE करिये'}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}
