'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ChevronLeft, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('254');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate phone number
    if (!phone.startsWith('254') || phone.length < 12) {
      setError('Please enter a valid Kenya phone number (254XXXXXXXXX)');
      setLoading(false);
      return;
    }

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
      setResendCountdown(60); // 60 second countdown
      
      // Start countdown
      const interval = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-sand-light">
      {/* Mobile-First Layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Side - Branding (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-light to-accent items-center justify-center p-8">
          <div className="max-w-md text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4">BiashaDrive</h1>
            <p className="text-lg text-white/90 mb-6">
              Grow your business with expert guidance and tools designed for Kenyan entrepreneurs.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Connect with verified experts</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Get personalized diagnostics</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Access business playbooks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form (Mobile Optimized) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-0">
          <div className="w-full max-w-sm">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
                Welcome to BiashaDrive
              </h1>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h1 className="text-2xl font-heading font-bold text-charcoal mb-2">Sign In</h1>
              <p className="text-charcoal/60">Grow your business with expert guidance</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-pulse">
                <p className="font-medium">⚠️ Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Dev Mode OTP Display */}
            {devOtp && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg text-accent-dark text-sm">
                <p className="font-medium mb-1">🧪 Test Mode</p>
                <p>Your OTP is: <strong className="text-lg tracking-widest font-mono">{devOtp}</strong></p>
              </div>
            )}

            {/* Phone Step */}
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-3">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="254712345678"
                    className="w-full px-4 py-4 text-lg border-2 border-sand-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white/50"
                    required
                  />
                  <p className="mt-2 text-xs text-charcoal/60">
                    Format: 254XXXXXXXXX (Kenyan number)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length < 12}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 sm:text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending code...
                    </span>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-charcoal mb-3">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-4 text-4xl border-2 border-sand-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center font-mono tracking-widest bg-white/50 transition-all"
                    required
                  />
                  <p className="mt-2 text-xs text-charcoal/60 text-center">
                    We sent a 6-digit code to {phone}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 sm:text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </span>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                {/* Resend Button */}
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError('');
                  }}
                  disabled={resendCountdown > 0}
                  className="w-full text-primary hover:text-primary-dark font-semibold text-center py-3 transition-colors disabled:text-charcoal/40 disabled:cursor-not-allowed"
                >
                  {resendCountdown > 0 ? (
                    `Resend code in ${resendCountdown}s`
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      Change Phone Number
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <p className="text-center text-xs text-charcoal/50 mt-8">
              By continuing, you agree to our <br />
              <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
