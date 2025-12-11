'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, DollarSign, Phone, TrendingUp } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  domain: string[];
  county: string;
  bio: string;
  rateMin: number;
  rateMax: number;
  rating: number;
  reviewCount: number;
  photoUrl?: string;
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('');

  useEffect(() => {
    fetchExperts();
  }, [selectedDomain]);

  const fetchExperts = async () => {
    try {
      const url = selectedDomain
        ? `/api/experts?domain=${selectedDomain}`
        : '/api/experts';
      const res = await fetch(url);
      const data = await res.json();
      setExperts(data.experts || []);
    } catch (error) {
      console.error('Failed to fetch experts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light">
      <header className="bg-white border-b border-sand-dark/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">BiashaDrive</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-charcoal mb-4">
            Verified Expert Network
          </h1>
          <p className="text-lg text-charcoal/60 mb-6">
            Connect with accountants, lawyers, branding experts, and more across Kenya
          </p>

          <div className="flex gap-3 flex-wrap">
            {['legal', 'accounting', 'branding', 'marketing', 'tech'].map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(selectedDomain === domain ? '' : domain)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDomain === domain
                    ? 'bg-primary text-white'
                    : 'bg-white border-2 border-sand-dark text-charcoal hover:border-primary'
                }`}
              >
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-charcoal/60">Loading experts...</div>
          </div>
        ) : experts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-charcoal/60">No experts available in this category</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <Link
                key={expert.id}
                href={`/experts/${expert.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-sand-dark/20 hover:border-primary/30 transition-all overflow-hidden group"
              >
                <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10"></div>

                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold text-charcoal mb-1 group-hover:text-primary transition-colors">
                    {expert.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold text-charcoal">{expert.rating.toFixed(1)}</span>
                    <span className="text-sm text-charcoal/60">({expert.reviewCount} reviews)</span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-charcoal/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {expert.county}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      KES {expert.rateMin} - {expert.rateMax}/hr
                    </div>
                  </div>

                  <p className="text-sm text-charcoal/70 mb-4 line-clamp-2">{expert.bio}</p>

                  <div className="flex gap-2 flex-wrap">
                    {expert.domain.slice(0, 2).map((d) => (
                      <span
                        key={d}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <button className="w-full mt-4 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-medium transition-colors">
                    Book Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
