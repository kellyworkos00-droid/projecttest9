# BiashaDrive

**Empowering Kenyan Businesses to Grow with Confidence**

BiashaDrive is a problem-solving web application designed to help Kenyan MSMEs and startups diagnose challenges, access localized guidance, connect with experts, and unlock capital opportunities—all in one platform.

---

## 🚀 Value Proposition

- **Smart Diagnostics**: Answer 8-12 questions and get personalized action plans for marketing, finance, operations, or compliance.
- **Localized Playbooks**: Step-by-step guides for KRA PIN, eTIMS, M-Pesa setup, county permits, cashflow management, and more.
- **Expert Marketplace**: Book vetted accountants, lawyers, and consultants. Pay securely via M-Pesa.
- **Capital Readiness**: Access grant calendars, pitch templates, investor eligibility checkers, and data room checklists.
- **Business Tools**: Cashflow tracker, VAT calculator, M-Pesa reconciliation helper, and pricing tools.
- **Community Q&A**: Get answers from peers and verified experts across all 47 counties.

---

## 🎯 Target Audience

1. **Micro-retail owners** transitioning from informal to formal (KRA, eTIMS, cashflow).
2. **Online sellers** growing via social commerce, WhatsApp catalogs, and fulfillment.
3. **Professional services solopreneurs** (lawyers, consultants) needing brand, lead-gen, and invoicing support.
4. **Early-stage startups** preparing pitch decks, financial models, and grant applications.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS (custom Kenya-inspired design system)
- **Icons**: Lucide React
- **Fonts**: Space Grotesk (headings), Mulish (body)
- **Payments**: Safaricom Daraja (M-Pesa), Stripe (card fallback)
- **Notifications**: WhatsApp (Meta Cloud API), SMS (Africa's Talking), Email (SendGrid)
- **Hosting**: Vercel (frontend), Railway/Render/Fly (backend when added)

---

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/kellyworkos00-droid/projecttest9.git
   cd projecttest9
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**:
   - Copy \`.env.example\` to \`.env\`:
     \`\`\`bash
     cp .env.example .env
     \`\`\`
   - Fill in your API keys (M-Pesa, WhatsApp, SendGrid, etc.)

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open in browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎨 Design System

### Colors
- **Primary**: Deep Green (#0B3B2E) – trust, growth
- **Accent**: Warm Amber (#F5A300) – energy, action
- **Clay**: Terracotta (#D56B46) – community, warmth
- **Sand**: Light Beige (#F4E9D7) – backgrounds
- **Charcoal**: Near-Black (#1D1D1B) – text

### Typography
- **Headings**: Space Grotesk (bold, modern)
- **Body**: Mulish (clean, readable)

### Key Principles
- Mobile-first, responsive design
- High contrast (WCAG AA 4.5:1 minimum)
- Bilingual support (English/Swahili toggle)
- Offline-friendly PWA features (coming soon)

---

## 🗂️ Project Structure

\`\`\`
biashadrive/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx             # Landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx         # User dashboard
│   │   └── globals.css          # Tailwind + global styles
│   ├── components/              # Reusable UI components (to be added)
│   └── lib/                     # Utilities, API helpers (to be added)
├── public/                      # Static assets
├── .env.example                 # Environment template
├── tailwind.config.ts           # Custom design tokens
├── tsconfig.json                # TypeScript config
├── next.config.mjs              # Next.js config
└── package.json
\`\`\`

---

## 📈 Revenue Model (for Your Company)

1. **Commission on Expert Bookings**: 15–25% per transaction
2. **Premium Subscription**: Advanced tools, priority support, multi-user teams (KES 2K–5K/mo)
3. **Sponsored Content**: Banks, telcos, accelerators sponsor playbooks/templates
4. **Lead Generation**: Fees from service providers (legal, accounting, SaaS)
5. **White-Label Licensing**: Partner with banks/telcos for SME engagement
6. **Data Insights**: Anonymized reports on SME trends for policy/NGO clients

---

## 🛠️ MVP Features (6–8 weeks)

- [ ] Auth (phone/WhatsApp), onboarding survey, bilingual support
- [ ] One diagnostic track (cashflow & compliance) → action plan + templates
- [ ] Playbook library (10–15 guides) with downloads
- [ ] Simple tools: cashflow XLS export, VAT calculator
- [ ] Expert marketplace v1: list + inquiry form + M-Pesa payment link
- [ ] Notifications: weekly WhatsApp/email digest
- [ ] Admin console for playbooks, experts, deadlines

---

## 🎯 Key Metrics (KPIs)

- **Activation**: % completing onboarding + first diagnostic
- **Engagement**: Weekly active users, tasks completed, template downloads
- **Conversion**: Inquiries to experts, paid transactions, repeat bookings
- **Outcome**: Self-reported revenue/cost improvements, retention (30/90 days)

---

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repo
2. Create a feature branch (\`git checkout -b feature/your-feature\`)
3. Commit changes (\`git commit -m 'Add your feature'\`)
4. Push to branch (\`git push origin feature/your-feature\`)
5. Open a Pull Request

---

## 📄 License

Proprietary. © 2025 BiashaDrive. All rights reserved.

---

## 📞 Contact

- **Email**: hello@biashadrive.com
- **WhatsApp**: +254 700 000 000
- **Twitter**: [@BiashaDrive](https://twitter.com/biashadrive)

---

**Built with ❤️ for Kenyan businesses.**
