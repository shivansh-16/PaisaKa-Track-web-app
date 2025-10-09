'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Protected from '@/components/Protected';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

function NameEditor({ user, updateProfile }: { user: any; updateProfile: (u: Partial<any>) => Promise<boolean> }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [busy, setBusy] = useState(false);

  return (
    <div>
      {!editing ? (
        <>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--pk-text-primary)' }}>{user?.name ?? user?.email ?? 'Your name'}</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--pk-text-secondary)' }}>{user?.email ?? '—'} {user?.phone ? `• ${user.phone}` : ''}</p>
          <button className="pk-button-secondary text-sm" onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      ) : (
        <div className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded border" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }} />
          <div className="flex gap-2">
            <button className="pk-button-primary flex-1" disabled={busy} onClick={async () => {
              setBusy(true);
              const ok = await updateProfile({ name });
              setBusy(false);
              if (ok) setEditing(false);
            }}>{busy ? 'Saving…' : 'Save'}</button>
            <button className="pk-button-secondary" onClick={() => { setEditing(false); setName(user?.name || ''); }} disabled={busy}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { lang, setLang, T } = useLanguage();
  const { logout, user, updateProfile } = useAuth(); // <-- include user and updater
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  return (
    <Protected>
      <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <a href="/" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
            ←
          </a>
          <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>{T('welcome.title')}</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang('hi')} className="p-2 rounded border" style={{ borderColor: 'var(--pk-border)' }}>हिं</button>
            <button onClick={() => setLang('en')} className="p-2 rounded border" style={{ borderColor: 'var(--pk-border)' }}>EN</button>
          </div>
        </header>

        <main className="space-y-6">
          {/* Profile Card */}
          <section className="pk-card text-center">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-4" style={{ background: 'var(--pk-orange)' }}>
              👤
            </div>
              <div>
                {/** Name display / edit */}
                <NameEditor user={user} updateProfile={updateProfile} />
              </div>
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
            <button
              className="pk-button-danger w-full"
              onClick={async () => {
                try {
                  setIsLoggingOut(true);
                  await logout();
                  // redirect to welcome/login after logout
                  router.push('/welcome');
                } catch (err) {
                  console.error('Logout failed', err);
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out…' : '🚪 Logout'}
            </button>
          </section>
        </main>
      </div>
    </Protected>
  );
}
