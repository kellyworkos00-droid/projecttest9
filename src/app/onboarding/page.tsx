'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Kiambu',
  'Meru', 'Nyeri', 'Kakamega', 'Bungoma', 'Kericho', 'Kitale', 'Garissa', 'Other'
];

const SECTORS = [
  'Retail', 'Food & Beverage', 'Professional Services', 'Technology', 'Agriculture',
  'Manufacturing', 'Transport & Logistics', 'Education', 'Healthcare', 'Other'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    county: '',
    sector: '',
    stage: 'startup',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (step === 1 && !formData.name) {
      setError('Please enter your name');
      return;
    }
    if (step === 2 && !formData.businessName) {
      setError('Please enter your business name');
      return;
    }
    if (step === 3 && !formData.county) {
      setError('Please select your county');
      return;
    }
    if (step === 4 && !formData.sector) {
      setError('Please select your business sector');
      return;
    }
    
    setError('');
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light to-white">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Side - Hero Image (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-light to-accent items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/50 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8">
              <Image
                src="/on pic biashara.jpg"
                alt="Business Growth"
                width={400}
                height={300}
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                priority
              />
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Tell Us About Your Business
            </h2>
            <p className="text-white/90">
              This helps us personalize your experience and connect you with the right experts.
            </p>
          </div>
        </div>

        {/* Right Side - Form (Mobile Optimized) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-0">
          <div className="w-full max-w-sm">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal mb-2">
                Tell Us About Your Business
              </h1>
              <p className="text-charcoal/60 text-sm">
                Step {step} of 5 - Takes 2 minutes
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-sand-dark/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-charcoal/60">{step}/5</span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-charcoal">
                Tell Us About Your Business
              </h1>
              <p className="text-charcoal/60">This helps us personalize your experience</p>
            </div>

            {/* Progress Bar Mobile */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      dot <= step ? 'bg-primary' : 'bg-sand-dark/20'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <p className="font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Name */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-3">
                      What's your name?
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g., Sarah Kipchoge"
                      autoFocus
                      className="w-full px-4 py-4 text-lg border-2 border-sand-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Step 2: Business Name */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-semibold text-charcoal mb-3">
                      What's your business name?
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => {
                        setFormData({ ...formData, businessName: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g., Sarah's Boutique"
                      autoFocus
                      className="w-full px-4 py-4 text-lg border-2 border-sand-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 border-2 border-sand-dark text-charcoal py-4 rounded-xl font-semibold transition-all hover:bg-sand-light"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: County */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label htmlFor="county" className="block text-sm font-semibold text-charcoal mb-3">
                      Which county are you in?
                    </label>
                    <select
                      id="county"
                      value={formData.county}
                      onChange={(e) => {
                        setFormData({ ...formData, county: e.target.value });
                        setError('');
                      }}
                      autoFocus
                      className="w-full px-4 py-4 text-lg border-2 border-sand-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition-all"
                    >
                      <option value="">Select your county...</option>
                      {COUNTIES.map((county) => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 border-2 border-sand-dark text-charcoal py-4 rounded-xl font-semibold transition-all hover:bg-sand-light"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Sector */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label htmlFor="sector" className="block text-sm font-semibold text-charcoal mb-3">
                      What sector is your business in?
                    </label>
                    <select
                      id="sector"
                      value={formData.sector}
                      onChange={(e) => {
                        setFormData({ ...formData, sector: e.target.value });
                        setError('');
                      }}
                      autoFocus
                      className="w-full px-4 py-4 text-lg border-2 border-sand-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 transition-all"
                    >
                      <option value="">Select your sector...</option>
                      {SECTORS.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 border-2 border-sand-dark text-charcoal py-4 rounded-xl font-semibold transition-all hover:bg-sand-light"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Business Stage */}
              {step === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-4">
                      What stage is your business at?
                    </label>
                    <div className="space-y-3">
                      {['startup', 'growing', 'established'].map((stage) => (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, stage });
                            setError('');
                          }}
                          className={`w-full px-4 py-4 rounded-xl border-2 font-semibold text-left transition-all ${
                            formData.stage === stage
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-sand-dark/30 text-charcoal/60 hover:border-primary/50 bg-white/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                formData.stage === stage
                                  ? 'border-primary bg-primary'
                                  : 'border-sand-dark/30'
                              }`}
                            />
                            <div>
                              <div className="font-semibold">{stage.charAt(0).toUpperCase() + stage.slice(1)}</div>
                              <div className="text-xs opacity-75">
                                {stage === 'startup' && 'Just starting or less than 1 year'}
                                {stage === 'growing' && 'Growing with 1-3 years in business'}
                                {stage === 'established' && 'Established with 3+ years'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 border-2 border-sand-dark text-charcoal py-4 rounded-xl font-semibold transition-all hover:bg-sand-light"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating profile...
                        </span>
                      ) : (
                        'Get Started!'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
