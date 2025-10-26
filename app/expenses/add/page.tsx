'use client';

    import { useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { useAuth } from '@/context/AuthContext';
    import { useLanguage } from '@/context/LanguageContext';

    export default function AddExpense() {
      const [formData, setFormData] = useState({
        amount: '',
        category: '',
        title: '',
        description: '',
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

        // Check if amount is provided and is a valid number
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

        // Frontend guard: validate against MAX_EXPENSE_AMOUNT
        const { MAX_EXPENSE_AMOUNT } = await import('@/lib/constants');
        if (Math.abs(amountValue) > MAX_EXPENSE_AMOUNT) {
          const msg = lang === 'hi'
            ? `राशि अधिक है। कृपया ₹${MAX_EXPENSE_AMOUNT.toLocaleString()} से कम राशि दर्ज करें।`
            : `Amount too high. Please enter a value below ₹${MAX_EXPENSE_AMOUNT.toLocaleString()} for expenses.`;
          try { window.dispatchEvent(new CustomEvent('toast', { detail: { message: msg } })); } catch (e) { /* ignore */ }
          setError(msg);
          setIsLoading(false);
          return;
        }

        try {
          // Validate amount is a proper number
          const amountValue = parseFloat(formData.amount);
          if (isNaN(amountValue) || amountValue <= 0) {
            setError('Please enter a valid amount greater than zero');
            setIsLoading(false);
            return;
          }
          
          const payload = {
            type: 'expense',
            amount: Math.abs(amountValue),
            category: formData.category,
            language: lang,
            title: formData.title || null,
            note: formData.description || null,
            occurred_at: new Date().toISOString(),
          };
          const { getBrowserSupabase } = await import('@/lib/db');
          const supabase = getBrowserSupabase();
          const session = await supabase.auth.getSession();
          const token = session?.data?.session?.access_token;
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const res = await fetch('/api/expenses', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Failed to save');
          // notify other parts of the app to refresh expenses (ExpenseProvider listens for this)
          try { window.dispatchEvent(new Event('paisa_expense_added')); } catch (e) { /* ignore */ }
          router.push('/');
        } catch (err) {
          setError('Failed to add expense. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      return (
        <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <a href="/" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
              ←
            </a>
            <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>खर्च Add करें</h1>
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
                    { emoji: '🍕', name: lang === 'hi' ? 'भोजन' : 'Food' },
                    { emoji: '🚗', name: lang === 'hi' ? 'यातायात' : 'Transport' },
                    { emoji: '☕', name: lang === 'hi' ? 'चाय' : 'Tea' },
                    { emoji: '🎬', name: lang === 'hi' ? 'मनोरंजन' : 'Movies' },
                    { emoji: '🏥', name: lang === 'hi' ? 'चिकित्सा' : 'Medical' },
                    { emoji: '🛒', name: lang === 'hi' ? 'खरीदारी' : 'Shopping' },
                    { emoji: '👕', name: lang === 'hi' ? 'कपड़े' : 'Clothes' },
                    { emoji: '💡', name: lang === 'hi' ? 'बिल' : 'Bills' },
                    { emoji: '🎓', name: lang === 'hi' ? 'शिक्षा' : 'Education' },
                  ].map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => handleCategorySelect(category.name)}
                      className={`p-4 rounded-lg border text-center ${formData.category === category.name
                        ? 'border-orange-500 bg-orange-50'
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

              {/* Photo Upload */}
              <section className="pk-card">
                <h2 className="pk-section-title mb-4">📷 Bill की Photo (Optional)</h2>
                <button type="button" className="w-full p-6 border-2 border-dashed rounded-lg text-center" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
                  <div className="text-3xl mb-2">📷</div>
                  <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Photo Click करिये</div>
                </button>
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
