import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Users, FileText, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-light to-white">
      {/* Header */}
      <header className="border-b border-sand-dark/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-primary">BiashaDrive</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-charcoal hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-charcoal hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-charcoal hover:text-primary transition-colors">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <select className="text-sm border border-sand-dark rounded-lg px-3 py-1.5 bg-white">
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
              </select>
              <Link
                href="/dashboard"
                className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-dark px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Built for Kenyan Businesses</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-heading font-bold text-charcoal mb-6 leading-tight">
              Grow Your Business with Confidence
            </h1>
            <p className="text-xl text-charcoal/70 mb-8 leading-relaxed">
              Get personalized guidance, localized playbooks, expert support, and tools tailored to help your Kenyan business thrive—from registration to revenue growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Start Free Diagnostic
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-12">
              <div>
                <div className="text-3xl font-heading font-bold text-primary">3,200+</div>
                <div className="text-sm text-charcoal/60">Active Businesses</div>
              </div>
              <div className="w-px h-12 bg-sand-dark"></div>
              <div>
                <div className="text-3xl font-heading font-bold text-primary">180+</div>
                <div className="text-sm text-charcoal/60">Verified Experts</div>
              </div>
              <div className="w-px h-12 bg-sand-dark"></div>
              <div>
                <div className="text-3xl font-heading font-bold text-primary">47</div>
                <div className="text-sm text-charcoal/60">All Counties</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 backdrop-blur-sm border border-primary/20">
              <div className="bg-white rounded-xl shadow-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">Cashflow Analysis</h3>
                    <p className="text-sm text-charcoal/60">Get real-time insights on your business health</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-accent-dark" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">KRA & eTIMS Compliance</h3>
                    <p className="text-sm text-charcoal/60">Stay compliant with step-by-step guides</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-clay/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-clay" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal mb-1">Expert Marketplace</h3>
                    <p className="text-sm text-charcoal/60">Connect with verified accountants & lawyers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 border-y border-sand-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-charcoal mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
              Practical tools and guidance designed specifically for Kenyan businesses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle2,
                title: "Smart Diagnostics",
                description: "Answer 8-12 questions and get a personalized action plan for marketing, finance, or operations.",
                color: "primary",
              },
              {
                icon: FileText,
                title: "Localized Playbooks",
                description: "Step-by-step guides for KRA PIN, eTIMS, M-Pesa setup, county permits, and more.",
                color: "accent",
              },
              {
                icon: Users,
                title: "Expert Marketplace",
                description: "Book vetted accountants, lawyers, and consultants. Pay securely via M-Pesa.",
                color: "clay",
              },
              {
                icon: TrendingUp,
                title: "Capital Readiness",
                description: "Access grant calendars, pitch templates, and investor eligibility checkers.",
                color: "primary",
              },
              {
                icon: Sparkles,
                title: "Business Tools",
                description: "Cashflow tracker, VAT calculator, M-Pesa reconciliation, and pricing tools.",
                color: "accent",
              },
              {
                icon: Users,
                title: "Community Q&A",
                description: "Get answers from peers and verified experts across all 47 counties.",
                color: "clay",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-sand-light/50 rounded-xl p-6 border border-sand-dark/30 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 bg-${feature.color}/10 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                  {feature.title}
                </h3>
                <p className="text-charcoal/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join 3,200+ Kenyan MSMEs using BiashaDrive to stay compliant, improve cashflow, access capital, and connect with expert support—all in one platform.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-heading font-bold text-white">BiashaDrive</span>
              </div>
              <p className="text-sm">
                Empowering Kenyan businesses with expert guidance and practical tools.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-accent transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
                <li><Link href="/playbooks" className="hover:text-accent transition-colors">Playbooks</Link></li>
                <li><Link href="/experts" className="hover:text-accent transition-colors">Experts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-sm text-center">
            <p>&copy; 2025 BiashaDrive. All rights reserved. Built for Kenyan businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
