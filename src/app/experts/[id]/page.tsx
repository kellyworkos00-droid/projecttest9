'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, DollarSign, ArrowLeft, Send } from 'lucide-react';

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

export default function ExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    service: '',
    message: '',
    amount: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch expert details
    // For now, we'll use mock data since we don't have a single expert endpoint
    // In production, create /api/experts/[id] route
    setExpert({
      id: params.id as string,
      name: 'Jane Kariuki',
      domain: ['accounting', 'tax'],
      county: 'Nairobi',
      bio: 'Certified public accountant with 8+ years experience helping Kenyan SMEs with bookkeeping, tax planning, and compliance.',
      rateMin: 2500,
      rateMax: 5000,
      rating: 4.8,
      reviewCount: 42,
    });
    setLoading(false);
  }, [params.id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      // Step 1: Create booking
      const bookingRes = await fetch('/api/experts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expertId: expert!.id,
          service: bookingData.service,
          message: bookingData.message,
          amount: bookingData.amount,
        }),
      });

      const bookingResult = await bookingRes.json();

      if (!bookingRes.ok) {
        throw new Error(bookingResult.error || 'Failed to create booking');
      }

      // Step 2: Initiate M-Pesa payment
      const mpesaRes = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingData.amount,
          phoneNumber: '254712345678', // Get from user in production
          accountReference: bookingResult.booking.id,
          transactionDesc: `BiashaDrive: ${bookingData.service}`,
        }),
      });

      const mpesaResult = await mpesaRes.json();

      if (!mpesaRes.ok) {
        throw new Error(mpesaResult.error || 'Failed to initiate payment');
      }

      // Show success message
      alert(`Payment initiated! Check your phone for M-Pesa prompt.\nCheckout Request ID: ${mpesaResult.checkoutRequestId}`);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!expert) {
    return <div className="text-center py-20">Expert not found</div>;
  }

  return (
    <div className="min-h-screen bg-sand-light">
      <header className="bg-white border-b border-sand-dark/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link href="/experts" className="flex items-center gap-2 text-charcoal hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Experts</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Expert Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-sand-dark/20">
              <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-6"></div>

              <h1 className="text-4xl font-heading font-bold text-charcoal mb-2">
                {expert.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-semibold text-charcoal">{expert.rating}</span>
                  <span className="text-charcoal/60">({expert.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-charcoal">{expert.county} County</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-charcoal">
                    KES {expert.rateMin.toLocaleString()} - {expert.rateMax.toLocaleString()} per hour
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-heading font-bold text-charcoal mb-3">About</h2>
                <p className="text-charcoal/70 text-lg leading-relaxed">{expert.bio}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-heading font-bold text-charcoal mb-3">Expertise</h2>
                <div className="flex gap-2 flex-wrap">
                  {expert.domain.map((d) => (
                    <span
                      key={d}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium"
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-sand-dark/20 sticky top-20">
              <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Book Now</h2>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={bookingData.service}
                    onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                    placeholder="e.g., Tax Audit"
                    className="w-full px-3 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Message
                  </label>
                  <textarea
                    value={bookingData.message}
                    onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                    placeholder="Describe what you need..."
                    rows={3}
                    className="w-full px-3 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={bookingData.amount}
                    onChange={(e) => setBookingData({ ...bookingData, amount: parseInt(e.target.value) })}
                    placeholder="5000"
                    min={expert.rateMin}
                    max={expert.rateMax * 8}
                    className="w-full px-3 py-2 border border-sand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <p className="text-xs text-charcoal/60 mt-1">
                    Suggested: KES {expert.rateMin} - {expert.rateMax * 8}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-sand-dark/20">
                <p className="text-xs text-charcoal/60 text-center">
                  🔒 Secure payment via M-Pesa STK Push
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
