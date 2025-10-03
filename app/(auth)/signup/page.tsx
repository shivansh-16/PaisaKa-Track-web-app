'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getBrowserSupabase } from '@/lib/db';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      if (success) {
        router.push('/');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (e) {
      setError('Google sign-in failed');
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
          <h2 className="text-2xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>Create Account</h2>
          <p className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Join thousands managing their money smartly</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="pk-card space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--pk-red)', color: 'white' }}>
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pk-text-primary)' }}>
              Full Name
            </label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter your full name"
              className="w-full p-4 rounded-lg border"
              style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pk-text-primary)' }}>
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              placeholder="your@email.com"
              className="w-full p-4 rounded-lg border"
              style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pk-text-primary)' }}>
              Mobile Number
            </label>
            <input 
              type="tel" 
              name="phone"
              placeholder="+91 98765 43210"
              className="w-full p-4 rounded-lg border"
              style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pk-text-primary)' }}>
              Create Password
            </label>
            <div className="relative">
              <input 
                type="password" 
                name="password"
                placeholder="Minimum 8 characters"
                className="w-full p-4 pr-12 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2">
                👁️
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pk-text-primary)' }}>
              Confirm Password
            </label>
            <div className="relative">
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Re-enter your password"
                className="w-full p-4 pr-12 rounded-lg border"
                style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)', color: 'var(--pk-text-primary)' }}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2">
                👁️
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1" 
            />
            <p className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>
              I agree to the <a href="#" className="font-medium" style={{ color: 'var(--pk-orange)' }}>Terms & Conditions</a> and <a href="#" className="font-medium" style={{ color: 'var(--pk-orange)' }}>Privacy Policy</a>
            </p>
          </div>

          <button 
            type="submit" 
            className="pk-button-primary w-full text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 border-t" style={{ borderColor: 'var(--pk-border)' }}></div>
          <span className="px-4 text-sm" style={{ color: 'var(--pk-text-secondary)' }}>or</span>
          <div className="flex-1 border-t" style={{ borderColor: 'var(--pk-border)' }}></div>
        </div>

        {/* Google Signup */}
        <button onClick={handleGoogleSignup} className="w-full p-4 rounded-lg border flex items-center justify-center gap-3" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
          <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Continue with Google</span>
        </button>

        {/* Login Link */}
        <div className="text-center">
          <span className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Already have an account? </span>
          <a href="/login" className="text-sm font-medium" style={{ color: 'var(--pk-orange)' }}>Login</a>
        </div>
      </main>
    </div>
  );
}
