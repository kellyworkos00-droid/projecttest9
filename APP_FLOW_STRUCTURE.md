# BiashaDrive - Complete App Flow & Structure

## 1. USER JOURNEY & ENTRY POINTS

### New User Flow
```
Homepage (Landing Page)
    ↓
Select Language (English/Kiswahili)
    ↓
Click "Get Started" or "Book Expert"
    ↓
Phone/OTP Login (/login)
    ↓
Business Onboarding (/onboarding)
    → Enter: Business Name, County, Sector, Stage
    ↓
Access Dashboard (/dashboard)
```

### Dashboard Home (/dashboard)
After login, users see:
- **Quick Stats**: Tasks completed, playbooks saved, expert consultations
- **Current Plan Progress**: Visual progress bar (e.g., 4/7 tasks complete)
- **Capital Opportunities**: Available funding/grants this month
- **Action Buttons**:
  - "Start Diagnostic" → `/diagnostics`
  - "Browse Experts" → `/experts`
  - "View Playbooks" → `/dashboard/playbooks`

---

## 2. EXPERT MARKETPLACE SYSTEM

### How Experts Are Listed & Ranked

#### Expert Model (Database)
```typescript
Expert {
  id: unique identifier
  name: "Jane Kariuki"
  domain: ["accounting", "tax-planning"]  // Multiple specialties
  county: "Nairobi"
  bio: "Certified accountant with 8+ years experience"
  
  // PRICING
  rateMin: 2500    // KES per hour (minimum)
  rateMax: 5000    // KES per hour (maximum)
  
  // RATINGS & VERIFICATION
  rating: 4.8      // Average rating (0-5 stars)
  reviewCount: 24  // Number of reviews/completed bookings
  verified: true   // Blue checkmark badge
  available: true  // Currently accepting bookings
  
  photoUrl: "https://..."
}
```

#### Expert Discovery Flow

**Step 1: Browse Experts Page** (`/experts`)
- Lists ALL verified experts sorted by **highest rating first**
- Shows 5 categories to filter by:
  - **Legal** (lawyers, compliance advisors)
  - **Accounting** (bookkeepers, tax specialists)
  - **Branding** (graphic designers, brand strategists)
  - **Marketing** (digital marketers, SMM experts)
  - **Tech** (developers, IT consultants)

**Step 2: Expert Card Display**
Each expert card shows:
```
┌─────────────────────────────────┐
│ Jane Kariuki        [✓ Verified] │  ← Name + badge
│ ⭐ 4.8 (24 reviews)               │  ← Rating & review count
│ 📍 Nairobi                        │  ← Location
│ Accounting | Tax Planning         │  ← Expertise domains
│                                   │
│ Rate: KES 2,500 - 5,000/hour      │  ← Price range
│ "Certified accountant with..."    │  ← Bio preview
│                                   │
│ [View Profile & Book →]           │  ← CTA button
└─────────────────────────────────┘
```

**Step 3: Expert Detail Page** (`/experts/[id]`)
Shows:
- Full bio and credentials
- Complete domain/specialties list
- Rate breakdown (minimum to maximum hourly rate)
- All reviews (if implemented) and rating breakdown
- "Book Consultation" button → Triggers booking form

---

## 3. BOOKING & PAYMENT FLOW

### How Users Book & Pay

#### Step 1: Initiate Booking (`/experts/[id]`)
User fills booking form:
```
┌──────────────────────────────────┐
│ Book Consultation with Jane       │
├──────────────────────────────────┤
│ Service Type *                    │
│ [Business Setup] [Tax Planning] ▼ │
│                                  │
│ Message/Description *             │
│ [Textarea: "Help with quarterly...│
│                                  │
│ Estimated Hours *                 │
│ [Select: 1 hour] ▼                │
│                                  │
│ Calculated Rate                  │
│ KES 2,500 - 5,000                │
│                                  │
│ [ Proceed to Payment ]            │
└──────────────────────────────────┘
```

#### Step 2: Payment Initiation via M-Pesa

**Backend Process:**
1. API Route: `POST /api/experts` (creates booking + transaction)
2. Creates `Transaction` record:
   ```
   Transaction {
     userId: "user123"
     amount: 2500  // KES
     provider: "mpesa"
     status: "pending"
     phoneNumber: "254712345678"
   }
   ```
3. Creates `Booking` record:
   ```
   Booking {
     userId: "user123"
     expertId: "expert456"
     service: "Tax Planning"
     message: "Help with quarterly returns"
     amount: 2500
     status: "pending"
     transactionId: "txn789"  // Links to transaction
   }
   ```

**Frontend (M-Pesa STK Push):**
- Calls `POST /api/mpesa/stk-push` with:
  - `amount`: 2500
  - `phoneNumber`: "254712345678"
  - `reference`: "BOOKING-expert456-user123"
  
- Safaricom API returns: `checkoutRequestId`
- **User sees STK popup on phone** asking to enter M-Pesa PIN
- User enters PIN → Payment confirmation

#### Step 3: Payment Confirmation (Webhook)
Safaricom sends callback to `POST /api/mpesa/callback`:
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020375212",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 2500 },
          { "Name": "MpesaReceiptNumber", "Value": "LHG31H500P" },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}
```

**Backend Action:**
1. Updates `Transaction`:
   - status: "pending" → "completed"
   - mpesaReceiptNumber: "LHG31H500P"
2. Updates `Booking`:
   - status: "pending" → "confirmed"
3. User receives confirmation SMS/WhatsApp

#### Step 4: After Payment - Booking Confirmed
- Expert is notified of new booking
- User sees booking confirmation page with:
  - Expert's contact details
  - Scheduled consultation time
  - Payment receipt
  - Next steps (follow-up call, meeting link, etc.)

---

## 4. REVENUE MODEL & CHARGES

### How BiashaDrive Makes Money

#### Commission Structure
```
User Pays Expert:           2,500 KES
                               ↓
BiashaDrive Commission:     250 KES (10%)
                               ↓
Expert Receives:            2,250 KES (90%)
```

#### Transaction Flow
```
User's M-Pesa Account
        ↓ (2,500 KES)
Safaricom Daraja API
        ↓ (Confirmed)
BiashaDrive Business Account (2,500 KES)
        ↓ (Split)
  ├─ Expert Payout: 2,250 KES (90%)
  └─ BiashaDrive: 250 KES (10%)
```

#### Where Charges Are Applied
1. **Expert Booking**: 10% platform fee on consultation rate
2. **Premium Features** (Future):
   - Advanced diagnostics
   - Priority expert matching
   - Video consultations
   - Business reports

---

## 5. TOP EXPERTS & RECOMMENDATIONS

### Ranking Algorithm

**Experts are ranked by:**

1. **Primary Sort**: `rating DESC` (highest rating first)
   - 4.8★ appears before 4.5★
   - Minimum threshold: 3.5★ to appear in marketplace

2. **Secondary Filters**:
   - `verified: true` (only blue-checkmark experts shown)
   - `available: true` (actively accepting bookings)
   - `domain` matches filter (e.g., "accounting")

### Database Query
```typescript
const experts = await prisma.expert.findMany({
  where: {
    verified: true,      // Must be verified
    available: true,     // Must be available
    domain: { hasSome: [domain] }  // Matches selected domain
  },
  orderBy: { rating: 'desc' },  // Sorted by rating
  select: {
    id, name, domain, county, bio,
    rateMin, rateMax,
    rating,      // ⭐ Stars
    reviewCount, // 📊 Number of completed jobs
    photoUrl
  }
});
```

### Top Experts Display

**Current Sample Data (5 Seeded Experts):**
```
1. James Mwangi (Legal)
   ⭐ 4.9 (32 reviews)
   Rate: KES 3,000 - 7,000/hour
   
2. Jane Kariuki (Accounting)
   ⭐ 4.8 (24 reviews)
   Rate: KES 2,500 - 5,000/hour
   
3. Sarah Kipchoge (Branding)
   ⭐ 4.7 (18 reviews)
   Rate: KES 1,500 - 4,000/hour
   
4. Peter Omondi (Tech)
   ⭐ 4.6 (15 reviews)
   Rate: KES 4,000 - 8,000/hour
   
5. Grace Mutua (Payroll/HR)
   ⭐ 4.5 (12 reviews)
   Rate: KES 2,000 - 4,500/hour
```

### How Reviews & Ratings Work

**Currently Configured (Not Yet Implemented):**

After expert consultation is completed:
1. User is prompted to leave review (1-5 stars)
2. Review updates expert's `rating` and `reviewCount`
3. Expert with more positive reviews ranks higher

**Fields Ready in Database:**
```typescript
Expert {
  rating: 4.8         // Updated from reviews
  reviewCount: 24     // Incremented after each review
}
```

**Implementation Needed:**
- Review submission form after booking completion
- Star rating widget
- Review text field
- Average calculation algorithm

---

## 6. USER EXPERIENCE JOURNEYS

### Journey 1: First-Time User Seeking Expert Help
```
1. Landing Page → Select Language → Get Started
2. Phone/OTP Login → Register
3. Business Onboarding (Name, County, Sector, Stage)
4. Dashboard → "Browse Experts"
5. Experts Page → Filter by Domain (e.g., "Accounting")
6. See Top 5 Accounting Experts sorted by ⭐ rating
7. Click on "Jane Kariuki" (4.8★, highest rated)
8. View full profile → Fill booking form
9. Click "Pay with M-Pesa" → Enter PIN
10. Booking confirmed → Expert contacts user
```

### Journey 2: User Looking for Top-Rated Expert
```
1. Dashboard → Browse Experts
2. Don't select domain filter → See ALL verified experts
3. List sorted by rating (highest first)
4. See James Mwangi (4.9★, 32 reviews) at top
5. Compare with others by scrolling
6. Book with top-rated expert
```

### Journey 3: Returning User
```
1. Dashboard shows "Continue with Expert" option
2. Quick access to previously booked experts
3. "Rebook" button for fast re-engagement
4. View past bookings and invoices
```

---

## 7. CURRENT IMPLEMENTATION STATUS

### ✅ Fully Implemented
- [x] Expert model in database with ratings/reviews fields
- [x] Expert listing page with domain filtering
- [x] Sorting by highest rating first
- [x] Verified badge display
- [x] Booking form on expert detail pages
- [x] Transaction & Booking creation
- [x] M-Pesa STK Push payment initiation
- [x] Payment callback webhook handler
- [x] Commission calculation logic (10% platform fee)
- [x] 5 sample experts seeded (with ratings)

### ⏳ Partially Implemented (Ready But Not Activated)
- [ ] Review submission form (database ready, UI needed)
- [ ] Rating calculation algorithm (database ready, logic needed)
- [ ] Booking completion status trigger for reviews
- [ ] Review display on expert profile pages

### 🚀 Future Enhancements
- [ ] Smart recommendation engine (based on user's diagnostic results)
- [ ] "Recommended for You" section on dashboard
- [ ] Expert matching algorithm (best match based on business sector)
- [ ] Video consultation integration
- [ ] Expert performance analytics (admin dashboard)
- [ ] Expert leaderboard/badges
- [ ] Referral rewards for highly-rated experts

---

## 8. DATABASE RELATIONSHIPS

```
User (user123)
 ├─ Booking ──→ Expert (expert456, Jane Kariuki, 4.8★)
 │    └─ Transaction (2500 KES, pending → completed)
 │
 ├─ Booking ──→ Expert (expert789, James Mwangi, 4.9★)
 │    └─ Transaction (3500 KES, completed)
 │
 └─ Diagnostic (cashflow domain) + saved Playbooks
```

**Key Constraint**: Each booking MUST link to a verified expert
```sql
-- Only verified, available experts can be booked
SELECT * FROM "Expert" 
WHERE verified = true AND available = true
ORDER BY rating DESC;
```

---

## 9. CONFIGURATION & CONSTANTS

### Expert Domains (Hardcoded)
```typescript
['legal', 'accounting', 'branding', 'marketing', 'tech']
```

### Rate Ranges (Per Hour, KES)
```
Legal: 3,000 - 7,000
Accounting: 2,500 - 5,000
Branding: 1,500 - 4,000
Marketing: 2,000 - 6,000
Tech: 4,000 - 8,000
```

### Rating Thresholds
```
Minimum to show in marketplace: 3.5★
"Top Expert" badge: 4.8★+
"Highly Rated" label: 4.5★+
```

### Commission Structure
```
Platform Commission: 10% of booking amount
Payment Provider Fee: 2.5% (M-Pesa Safaricom)
Net to Expert: 87.5% of original rate
```

---

## 10. SCHEMA DEFINITION

### Expert Table
```sql
CREATE TABLE "Expert" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  domain TEXT[] NOT NULL,           -- ["legal", "accounting"]
  county TEXT NOT NULL,
  bio TEXT NOT NULL,
  rateMin INTEGER NOT NULL,         -- 2500
  rateMax INTEGER NOT NULL,         -- 5000
  rating FLOAT DEFAULT 0,           -- 4.8
  reviewCount INTEGER DEFAULT 0,    -- 24
  verified BOOLEAN DEFAULT false,   -- true
  available BOOLEAN DEFAULT true,   -- true
  photoUrl TEXT,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

### Booking Table
```sql
CREATE TABLE "Booking" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL FOREIGN KEY,
  expertId TEXT NOT NULL FOREIGN KEY,
  service TEXT NOT NULL,            -- "Tax Planning"
  message TEXT NOT NULL,
  status TEXT DEFAULT "pending",    -- pending → confirmed → completed
  scheduledAt TIMESTAMP,
  amount INTEGER,                   -- 2500 KES
  transactionId TEXT UNIQUE,        -- Links to payment
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Transaction Table
```sql
CREATE TABLE "Transaction" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL FOREIGN KEY,
  amount INTEGER NOT NULL,          -- 2500 KES
  currency TEXT DEFAULT "KES",
  provider TEXT,                    -- "mpesa"
  status TEXT DEFAULT "pending",    -- pending → completed → failed
  mpesaReceiptNumber TEXT,          -- "LHG31H500P"
  mpesaCheckoutRequestId TEXT,
  phoneNumber TEXT,                 -- "254712345678"
  metadata JSON,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## 11. QUICK REFERENCE: URLS & ENDPOINTS

| Feature | URL | Method | Auth |
|---------|-----|--------|------|
| View all experts | `/experts` | GET | No |
| Filter by domain | `/experts?domain=accounting` | GET | No |
| Expert detail page | `/experts/[id]` | GET | No |
| Create booking | `/api/experts` | POST | JWT |
| Get experts (API) | `/api/experts` | GET | No |
| Initiate M-Pesa payment | `/api/mpesa/stk-push` | POST | JWT |
| Handle payment callback | `/api/mpesa/callback` | POST | No |
| Admin: Manage playbooks | `/admin/playbooks` | GET/POST | JWT + Admin |

---

## Summary

**BiashaDrive connects users with top-rated experts through:**

1. **User Registration**: Phone/OTP login → Business onboarding
2. **Expert Discovery**: Browse verified experts, filter by domain, sorted by rating (⭐)
3. **Booking System**: Select expert → Fill service details → Pay via M-Pesa
4. **Payment Split**: Platform takes 10%, expert gets 90%
5. **Rating System**: Reviews after completion increase expert visibility
6. **Recommendations**: Top-rated experts appear first, driving quality and trust

The system incentivizes:
- ✅ Experts to provide excellent service (higher ratings = more bookings)
- ✅ Users to leave reviews (helps community trust)
- ✅ BiashaDrive to scale (10% commission on every transaction)
