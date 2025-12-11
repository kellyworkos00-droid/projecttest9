'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, TrendingUp } from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS } from '@/lib/diagnostics';

export default function DiagnosticsPage() {
  const [domain, setDomain] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const router = useRouter();

  const questions = domain ? DIAGNOSTIC_QUESTIONS[domain as keyof typeof DIAGNOSTIC_QUESTIONS] : null;

  const handleDomainSelect = (selectedDomain: string) => {
    setDomain(selectedDomain);
    setCurrentQuestion(0);
    setResponses({});
  };

  const handleAnswer = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleNext = () => {
    if (questions && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domain, responses }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit diagnostic');
      }

      // Redirect to results page
      router.push(`/diagnostics/results/${data.diagnostic.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!domain) {
    return (
      <div className="min-h-screen bg-sand-light">
        <header className="bg-white border-b border-sand-dark/20">
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-charcoal mb-4">
              Choose a Diagnostic
            </h1>
            <p className="text-lg text-charcoal/60">
              Answer a few questions to get personalized recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handleDomainSelect('cashflow')}
              className="bg-white p-8 rounded-xl border-2 border-sand-dark/30 hover:border-primary hover:shadow-lg transition-all text-left"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-charcoal mb-2">
                Cashflow Health
              </h3>
              <p className="text-charcoal/60 mb-4">
                Assess your income tracking, expenses, and financial reserves
              </p>
              <span className="text-sm text-primary font-medium">5 questions • 3 min</span>
            </button>

            <button
              onClick={() => handleDomainSelect('compliance')}
              className="bg-white p-8 rounded-xl border-2 border-sand-dark/30 hover:border-primary hover:shadow-lg transition-all text-left"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent-dark" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-charcoal mb-2">
                Compliance Check
              </h3>
              <p className="text-charcoal/60 mb-4">
                Review KRA, eTIMS, county licenses, and tax filing status
              </p>
              <span className="text-sm text-accent-dark font-medium">5 questions • 3 min</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = questions![currentQuestion];
  const progress = ((currentQuestion + 1) / questions!.length) * 100;

  return (
    <div className="min-h-screen bg-sand-light">
      <header className="bg-white border-b border-sand-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">BiashaDrive</span>
            </Link>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'sw')}
              className="text-sm border border-sand-dark rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-charcoal/60">
              Question {currentQuestion + 1} of {questions!.length}
            </span>
            <span className="text-sm font-medium text-charcoal/60">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-sand-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-sand-dark/20">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-8">
            {language === 'sw' && currentQ.questionSw ? currentQ.questionSw : currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  responses[currentQ.id] === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-sand-dark hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      responses[currentQ.id] === option.value
                        ? 'border-primary bg-primary'
                        : 'border-charcoal/30'
                    }`}
                  >
                    {responses[currentQ.id] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-charcoal font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!responses[currentQ.id] || loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Submitting...'
                : currentQuestion < questions!.length - 1
                ? 'Next'
                : 'Get Results'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
