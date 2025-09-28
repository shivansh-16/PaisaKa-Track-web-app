export default function Profile() {
  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <a href="/" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ←
        </a>
        <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>Profile</h1>
        <button className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ⚙️
        </button>
      </header>

      <main className="space-y-6">
        {/* Profile Card */}
        <section className="pk-card text-center">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-4" style={{ background: 'var(--pk-orange)' }}>
            👤
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--pk-text-primary)' }}>Rahul Sharma</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--pk-text-secondary)' }}>rahul@email.com • +91 98765 43210</p>
          <button className="pk-button-secondary text-sm">
            Edit Profile
          </button>
        </section>

        {/* Account Stats */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">Account Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--pk-bg)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--pk-green)' }}>₹2,847</div>
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Total Balance</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--pk-bg)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--pk-blue)' }}>12</div>
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Active Groups</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--pk-bg)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--pk-orange)' }}>₹5,420</div>
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>This Month</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ background: 'var(--pk-bg)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--pk-red)' }}>₹1,200</div>
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Pending</div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">💳</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Bank Accounts</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">🔔</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Notifications</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">🌙</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Dark Mode</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">🌐</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Language</span>
              </div>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* Settings */}
        <section className="pk-card">
          <h2 className="pk-section-title mb-4">Settings</h2>
          <div className="space-y-3">
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">🔒</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Privacy & Security</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">📊</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Data & Backup</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">❓</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>Help & Support</span>
              </div>
              <span>→</span>
            </button>
            <button className="w-full p-4 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">ℹ️</span>
                <span style={{ color: 'var(--pk-text-primary)' }}>About</span>
              </div>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* Logout */}
        <section className="pb-6">
          <button className="pk-button-danger w-full">
            🚪 Logout
          </button>
        </section>
      </main>
    </div>
  );
}
