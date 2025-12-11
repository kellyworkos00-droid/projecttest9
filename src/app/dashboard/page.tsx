import Link from "next/link";
import { ArrowLeft, CheckCircle2, TrendingUp, FileText, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-sand-light">
      {/* Header */}
      <header className="bg-white border-b border-sand-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">BiashaDrive</span>
            </Link>
            <div className="flex items-center gap-4">
              <select className="text-sm border border-sand-dark rounded-lg px-3 py-1.5 bg-white">
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
              </select>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                KW
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Welcome back, Kelly!</h1>
          <p className="text-white/90 mb-6">Let's keep your business moving forward. Here's what we recommend today:</p>
          <Link
            href="/diagnostics"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start a New Diagnostic
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">4/7</span>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">Tasks Completed</h3>
            <p className="text-sm text-charcoal/60">3 remaining this week</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-dark" />
              </div>
              <span className="text-2xl font-heading font-bold text-accent-dark">12</span>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">Playbooks Saved</h3>
            <p className="text-sm text-charcoal/60">Access anytime</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-clay/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-clay" />
              </div>
              <span className="text-2xl font-heading font-bold text-clay">2</span>
            </div>
            <h3 className="font-semibold text-charcoal mb-1">Expert Consultations</h3>
            <p className="text-sm text-charcoal/60">This month</p>
          </div>
        </div>

        {/* Your Plan */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Your Current Plan</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-sand-light/50 rounded-lg">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">Register for eTIMS</h3>
                    <p className="text-sm text-charcoal/60 mb-2">Complete KRA online registration for tax invoicing</p>
                    <span className="text-xs text-primary font-medium">Completed</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white border-2 border-accent rounded-lg">
                  <div className="w-6 h-6 border-2 border-accent rounded flex-shrink-0 mt-0.5"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">Set Up M-Pesa Business Account</h3>
                    <p className="text-sm text-charcoal/60 mb-2">Get your Till or PayBill number for customer payments</p>
                    <span className="text-xs text-accent-dark font-medium">In Progress</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-sand-light/50 rounded-lg opacity-60">
                  <div className="w-6 h-6 border-2 border-charcoal/20 rounded flex-shrink-0 mt-0.5"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">Create Basic Cashflow Sheet</h3>
                    <p className="text-sm text-charcoal/60">Track income and expenses weekly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-4">Recommended for You</h2>
              <div className="space-y-4">
                <Link href="/playbooks/mpesa-reconciliation" className="block p-4 border border-sand-dark/30 rounded-lg hover:border-primary/50 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-accent-dark" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-charcoal mb-1">M-Pesa Reconciliation Guide</h3>
                      <p className="text-sm text-charcoal/60">Match your payments with sales records</p>
                      <span className="text-xs text-accent-dark font-medium mt-2 inline-block">10 min read</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-sand-dark/30">
              <h3 className="font-heading font-bold text-charcoal mb-4">Capital Opportunities</h3>
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="text-xs text-primary font-medium mb-1">Deadline: Dec 31, 2025</div>
                  <h4 className="text-sm font-semibold text-charcoal">AfDB Youth Grant</h4>
                  <p className="text-xs text-charcoal/60 mt-1">Up to KES 500K for youth-led businesses</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-clay/10 to-accent/10 rounded-xl p-6 border border-clay/20">
              <h3 className="font-heading font-bold text-charcoal mb-2">Need Expert Help?</h3>
              <p className="text-sm text-charcoal/70 mb-4">Connect with verified accountants and lawyers</p>
              <Link
                href="/experts"
                className="block text-center bg-clay hover:bg-clay-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Browse Experts
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
