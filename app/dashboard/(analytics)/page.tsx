import Link from 'next/link';

export default function Analytics() {
  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ←
        </Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>Analytics / विश्लेषण</h1>
        <div className="w-10"></div>
      </header>

      <main className="space-y-6">
        {/* Monthly Spending */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">📊 This Month's Spending</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">🍕</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Food</span>
              </div>
              <div className="text-right">
                <div className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹2,000</div>
                <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>40%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">🚗</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Transport</span>
              </div>
              <div className="text-right">
                <div className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹1,250</div>
                <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>25%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">☕</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Tea/Coffee</span>
              </div>
              <div className="text-right">
                <div className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹750</div>
                <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>15%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">🎬</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Entertainment</span>
              </div>
              <div className="text-right">
                <div className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹1,000</div>
                <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>20%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Budget Progress */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">🎯 Budget Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--pk-text-primary)' }}>Food</span>
                <span style={{ color: 'var(--pk-text-secondary)' }}>80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--pk-text-primary)' }}>Transport</span>
                <span style={{ color: 'var(--pk-text-secondary)' }}>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--pk-text-primary)' }}>Entertainment</span>
                <span style={{ color: 'var(--pk-text-secondary)' }}>70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Health */}
        <section className="pk-card text-center">
          <h2 className="pk-section-title mb-4">💡 Financial Health</h2>
          <div className="text-4xl mb-2">😊</div>
          <div className="text-lg font-bold mb-2" style={{ color: 'var(--pk-green)' }}>Good</div>
          <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>आप सही राह पर हैं!</div>
        </section>
      </main>
    </div>
  );
}
