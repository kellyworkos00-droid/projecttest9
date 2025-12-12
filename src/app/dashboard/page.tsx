'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  LogOut,
  Settings,
  Bell,
  Menu,
  X,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface User {
  id: string;
  phone: string;
  name: string | null;
  businessName: string | null;
  county: string | null;
  sector: string | null;
  stage: string | null;
  email: string | null;
  language: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Get user from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const companies = [
    { name: 'Tech Innovations Ltd', industry: 'Software' },
    { name: 'Green Agriculture Co', industry: 'Farming' },
    { name: 'Urban Retail Group', industry: 'Retail' },
    { name: 'Swift Logistics Inc', industry: 'Transportation' },
    { name: 'Creative Studios Pro', industry: 'Digital Services' },
    { name: 'Health Tech Solutions', industry: 'Healthcare' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % companies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + companies.length) % companies.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-charcoal/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || user?.businessName || 'Entrepreneur';
  const initials = (user?.name?.charAt(0) || user?.businessName?.charAt(0) || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-sand-light">
      {/* Header */}
      <header className="bg-white border-b border-sand-dark/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">BiashaDrive</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/experts"
                className="text-charcoal hover:text-primary transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Find Experts
              </Link>
              <Link
                href="/diagnostics"
                className="text-charcoal hover:text-primary transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Diagnostics
              </Link>
              <Link
                href="/dashboard"
                className="text-charcoal hover:text-primary transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Bookings
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-charcoal hover:bg-sand-light rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-sand-dark/20">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-charcoal">{userName}</p>
                  <p className="text-xs text-charcoal/60">{user?.sector || 'Business Owner'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-charcoal hover:bg-sand-light rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2 border-t border-sand-dark/20 pt-4">
              <Link
                href="/experts"
                className="block px-4 py-2 text-charcoal hover:bg-sand-light rounded-lg transition-colors"
              >
                Find Experts
              </Link>
              <Link
                href="/diagnostics"
                className="block px-4 py-2 text-charcoal hover:bg-sand-light rounded-lg transition-colors"
              >
                Diagnostics
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-charcoal hover:bg-sand-light rounded-lg transition-colors"
              >
                Bookings
              </Link>
              <button
                onClick={() => router.push('/dashboard')}
                className="block w-full text-left px-4 py-2 text-charcoal hover:bg-sand-light rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-primary via-primary-light to-accent text-white rounded-2xl overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Left Content */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-white/90 mb-6">
                  {user?.businessName && `${user.businessName}`}
                  {user?.county && ` • ${user.county}`}
                  {user?.sector && ` • ${user.sector}`}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-3">
                <Link
                  href="/diagnostics"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Start Diagnostic
                </Link>
                <Link
                  href="/experts"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Find Expert
                </Link>
              </div>
            </div>

            {/* Right - Smiles Image */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <Image
                  src="/smiles.png"
                  alt="Happy user using BiashaDrive"
                  width={400}
                  height={400}
                  className="rounded-xl w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Logout Button - Top Right */}
          <button
            onClick={handleLogout}
            className="absolute top-8 right-8 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/30 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">0</span>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">Bookings</h3>
            <p className="text-sm text-charcoal/60">This month</p>
          </div>

          {/* Active Experts */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/30 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-dark" />
              </div>
              <span className="text-2xl font-heading font-bold text-accent-dark">0</span>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">Consultations</h3>
            <p className="text-sm text-charcoal/60">Completed</p>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/30 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-heading font-bold text-green-600">KES 0</span>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">Amount Spent</h3>
            <p className="text-sm text-charcoal/60">All time</p>
          </div>

          {/* Diagnostics */}
          <div className="bg-white rounded-xl p-6 border border-sand-dark/30 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-clay/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-clay" />
              </div>
              <span className="text-2xl font-heading font-bold text-clay">0</span>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">Diagnostics</h3>
            <p className="text-sm text-charcoal/60">Completed</p>
          </div>
        </div>

        {/* Companies Slider */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-8">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-6 text-center">
            Trusted by Businesses Across Kenya
          </h2>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Slider Container */}
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {companies.map((company, index) => (
                  <div
                    key={index}
                    className="min-w-full flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-charcoal mb-2">
                        {company.name}
                      </h3>
                      <p className="text-charcoal/60 font-medium">
                        {company.industry}
                      </p>
                      <div className="mt-4 flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-accent text-lg">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 p-2 bg-primary hover:bg-primary-light text-white rounded-full transition-all transform hover:scale-110"
              aria-label="Previous company"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 p-2 bg-primary hover:bg-primary-light text-white rounded-full transition-all transform hover:scale-110"
              aria-label="Next company"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {companies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-primary w-8'
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to company ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/diagnostics" className="p-4 border-2 border-sand-dark/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <BarChart3 className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold text-charcoal text-sm">Run Business Diagnostic</p>
                  <p className="text-xs text-charcoal/60 mt-1">Get AI insights for your business</p>
                </Link>
                <Link href="/experts" className="p-4 border-2 border-sand-dark/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <Users className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold text-charcoal text-sm">Browse Experts</p>
                  <p className="text-xs text-charcoal/60 mt-1">Find consultants in your field</p>
                </Link>
                <Link href="/" className="p-4 border-2 border-sand-dark/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <BookOpen className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold text-charcoal text-sm">Access Playbooks</p>
                  <p className="text-xs text-charcoal/60 mt-1">Business guides & templates</p>
                </Link>
                <Link href="/dashboard" className="p-4 border-2 border-sand-dark/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <Settings className="w-6 h-6 text-primary mb-2" />
                  <p className="font-semibold text-charcoal text-sm">Profile Settings</p>
                  <p className="text-xs text-charcoal/60 mt-1">Update your information</p>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-sand-light/30 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-charcoal text-sm">Account Created</p>
                    <p className="text-xs text-charcoal/60 mt-1">Your BiashaDrive account is active</p>
                  </div>
                  <span className="text-xs text-charcoal/40 flex-shrink-0">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
              <h3 className="font-semibold text-charcoal mb-4">Business Profile</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-charcoal/60 uppercase tracking-wide font-medium">Business Name</p>
                  <p className="text-sm font-semibold text-charcoal mt-1">
                    {user?.businessName || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-charcoal/60 uppercase tracking-wide font-medium">Sector</p>
                  <p className="text-sm font-semibold text-charcoal mt-1">
                    {user?.sector || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-charcoal/60 uppercase tracking-wide font-medium">Stage</p>
                  <p className="text-sm font-semibold text-charcoal mt-1 capitalize">
                    {user?.stage ? (user.stage === 'startup' ? 'Start-up' : user.stage === 'growing' ? 'Growing' : 'Established') : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-charcoal/60 uppercase tracking-wide font-medium">Location</p>
                  <p className="text-sm font-semibold text-charcoal mt-1">
                    {user?.county || 'Not set'}
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors text-sm">
                Edit Profile
              </button>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-accent/10 to-clay/10 rounded-xl p-6 border border-sand-dark/30">
              <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-accent" />
                Recommended for You
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-charcoal mb-1">Complete Your Profile</p>
                  <p className="text-charcoal/60">Add a profile picture and email for better expert matching</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
