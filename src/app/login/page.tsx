'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('254');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }

      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on whether user is new
      if (data.isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sand-dark/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">
              Welcome to BiashaDrive
            </h1>
            <p className="text-charcoal/60">
              {step === 'phone' 
                ? 'Enter your phone number to get started' 
                : 'Enter the verification code we sent'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {devOtp && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg text-accent-dark text-sm">
              <strong>Dev Mode:</strong> Your OTP is <strong>{devOtp}</strong>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="254XXXXXXXXX"
                  className="w-full px-4 py-3 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="mt-2 text-xs text-charcoal/60">
                  Format: 254XXXXXXXXX (e.g., 254712345678)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-charcoal mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 mb-4"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-primary hover:text-primary-dark font-medium"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-charcoal/60 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
