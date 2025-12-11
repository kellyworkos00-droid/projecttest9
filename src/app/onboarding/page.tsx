'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Kiambu',
  'Meru', 'Nyeri', 'Kakamega', 'Bungoma', 'Kericho', 'Kitale', 'Garissa', 'Other'
];

const SECTORS = [
  'Retail', 'Food & Beverage', 'Professional Services', 'Technology', 'Agriculture',
  'Manufacturing', 'Transport & Logistics', 'Education', 'Healthcare', 'Other'
];

export default function OnboardingPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-sand-light to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sand-dark/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">
              Tell Us About Your Business
            </h1>
            <p className="text-charcoal/60">
              This helps us personalize your experience
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-charcoal mb-2">
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="county" className="block text-sm font-medium text-charcoal mb-2">
                County
              </label>
              <select
                id="county"
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-4 py-3 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select your county</option>
                {COUNTIES.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-charcoal mb-2">
                Business Sector
              </label>
              <select
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-4 py-3 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select your sector</option>
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Business Stage
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['startup', 'growing', 'established'].map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setFormData({ ...formData, stage })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.stage === stage
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-sand-dark text-charcoal/60 hover:border-primary/50'
                    }`}
                  >
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Continue to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
