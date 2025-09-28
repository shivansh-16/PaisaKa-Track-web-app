'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <a href="/welcome" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ←
        </a>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'var(--pk-orange)' }}>
            ₹
          </div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--pk-text-primary)' }}>PaisaKa Track</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>Welcome Back</h2>
          <p className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Sign in to continue managing your expenses</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="pk-card space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--pk-red)', color: 'white' }}>
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pk-text-primary)' }}>
              Enter email or mobile
            </label>
            <input 
              type="text" 
              placeholder="your@email.com or +91 98765 43210"
              className="w-full p-4 rounded-lg border"
              style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pk-text-primary)' }}>
              Enter password
            </label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Your password"
                className="w-full p-4 pr-12 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2">
                👁️
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="pk-button-primary w-full text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>

          <div className="text-center">
            <a href="#" className="text-sm" style={{ color: 'var(--pk-orange)' }}>Forgot Password?</a>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 border-t" style={{ borderColor: 'var(--pk-border)' }}></div>
          <span className="px-4 text-sm" style={{ color: 'var(--pk-text-secondary)' }}>or</span>
          <div className="flex-1 border-t" style={{ borderColor: 'var(--pk-border)' }}></div>
        </div>

        {/* Google Login */}
        <button className="w-full p-4 rounded-lg border flex items-center justify-center gap-3" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
          <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Continue with Google</span>
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Don't have an account? </span>
          <a href="/signup" className="text-sm font-medium" style={{ color: 'var(--pk-orange)' }}>Sign Up</a>
        </div>
      </main>
    </div>
  );
}
