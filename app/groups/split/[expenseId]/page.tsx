import Link from 'next/link';

export default function SplitExpense() {
  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/groups" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ←
        </Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>Room Expenses - Grocery</h1>
        <div className="w-10"></div>
      </header>

      <main className="space-y-6">
        {/* Expense Details */}
        <section className="pk-card text-center">
          <div className="text-sm mb-2" style={{ color: 'var(--pk-text-secondary)' }}>Total Amount</div>
          <div className="pk-amount-large mb-2">₹300</div>
          <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Paid By: <span className="font-semibold" style={{ color: 'var(--pk-text-primary)' }}>Rahul</span></div>
        </section>

        {/* Participant Selection */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">👥 Who will share?</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <input type="checkbox" checked className="w-5 h-5" style={{ accentColor: 'var(--pk-green)' }} />
              <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Rahul</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <input type="checkbox" checked className="w-5 h-5" style={{ accentColor: 'var(--pk-green)' }} />
              <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Amit</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <input type="checkbox" checked className="w-5 h-5" style={{ accentColor: 'var(--pk-green)' }} />
              <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Priya</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <input type="checkbox" className="w-5 h-5" style={{ accentColor: 'var(--pk-green)' }} />
              <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Mohan</span>
              <span className="text-sm ml-auto" style={{ color: 'var(--pk-text-secondary)' }}>(doesn't eat non-veg)</span>
            </label>
          </div>
        </section>

        {/* Split Calculation */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">🧮 Split Calculation</h2>
          <div className="text-center space-y-2">
            <div className="text-lg" style={{ color: 'var(--pk-text-primary)' }}>
              ₹300 ÷ 3 people = <span className="pk-amount" style={{ color: 'var(--pk-green)' }}>₹100 each</span>
            </div>
            <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>
              (Mohan excluded from split)
            </div>
          </div>
        </section>

        {/* Who Owes What */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">💸 Who owes what?</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--pk-bg)' }}>
              <span style={{ color: 'var(--pk-text-primary)' }}>Amit owes Rahul:</span>
              <span className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹100</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--pk-bg)' }}>
              <span style={{ color: 'var(--pk-text-primary)' }}>Priya owes Rahul:</span>
              <span className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹100</span>
            </div>
          </div>
        </section>

        {/* Payment Reminders */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">📱 Send Payment Reminders</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="pk-button-secondary">
              <div className="flex items-center justify-center gap-2">
                <span>💬</span>
                <span>WhatsApp</span>
              </div>
            </button>
            <button className="pk-button-warning">
              <div className="flex items-center justify-center gap-2">
                <span>📱</span>
                <span>SMS</span>
              </div>
            </button>
          </div>
        </section>

        {/* Confirm Button */}
        <section className="pb-6">
          <button className="pk-button-primary w-full text-lg">
            ✅ CONFIRM SPLIT
          </button>
        </section>
      </main>
    </div>
  );
}
