import VoiceInput from '@/components/VoiceInput';

export default function AddGroupExpense() {
  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <a href="/groups" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ←
        </a>
        <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>Add Group Expense</h1>
        <div className="w-10"></div>
      </header>

      <main className="space-y-6">
        {/* Group Info */}
        <section className="pk-card">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎉</span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--pk-text-primary)' }}>Ganesh Festival</h2>
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>12 members • ₹6,500 remaining</div>
            </div>
          </div>
        </section>

        {/* Amount Input */}
        <section className="pk-card text-center">
          <div className="text-sm mb-2" style={{ color: 'var(--pk-text-secondary)' }}>Amount (रुपये)</div>
          <div className="text-4xl font-bold pk-rupee">₹</div>
          <input 
            type="number" 
            placeholder="100" 
            className="text-4xl font-bold text-center border-none outline-none w-full"
            style={{ background: 'transparent', color: 'var(--pk-text-primary)' }}
          />
        </section>

        {/* Itemized Breakdown */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">Itemized Breakdown</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="Item name (e.g., Tomato)"
                className="flex-1 p-3 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              />
              <input 
                type="number" 
                placeholder="₹30"
                className="w-20 p-3 rounded-lg border text-center"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              />
              <button className="p-3 rounded-lg border" style={{ borderColor: 'var(--pk-red)', background: 'var(--pk-card)' }}>
                ❌
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="Item name (e.g., Potato)"
                className="flex-1 p-3 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              />
              <input 
                type="number" 
                placeholder="₹50"
                className="w-20 p-3 rounded-lg border text-center"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              />
              <button className="p-3 rounded-lg border" style={{ borderColor: 'var(--pk-red)', background: 'var(--pk-card)' }}>
                ❌
              </button>
            </div>
            <button className="w-full p-3 rounded-lg border border-dashed flex items-center justify-center gap-2" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <span>➕</span>
              <span style={{ color: 'var(--pk-text-secondary)' }}>Add Item</span>
            </button>
          </div>
        </section>

        {/* Paid By Selection */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">Paid By</h2>
          <select className="w-full p-4 rounded-lg border" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}>
            <option>Select who paid</option>
            <option>Rahul</option>
            <option>Papa</option>
            <option>Sharma Uncle</option>
            <option>Anil</option>
            <option>Ramesh</option>
            <option>Priya</option>
          </select>
        </section>

        {/* Description */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">📝 Description</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Add description (optional)..." 
              className="w-full p-4 pr-12 rounded-lg border"
              style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <VoiceInput 
                onTranscript={(text) => {
                  const input = document.querySelector('input[placeholder="Add description (optional)..."]') as HTMLInputElement;
                  if (input) input.value = text;
                }}
                className="p-2"
              />
            </div>
          </div>
        </section>

        {/* Photo Upload */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">📷 Receipt Photo (Optional)</h2>
          <button className="w-full p-6 border-2 border-dashed rounded-lg text-center" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
            <div className="text-3xl mb-2">📷</div>
            <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Photo Click करिये</div>
          </button>
        </section>

        {/* Save Button */}
        <section className="pb-6">
          <button className="pk-button-primary w-full text-lg">
            ✅ SAVE EXPENSE
          </button>
        </section>
      </main>
    </div>
  );
}
