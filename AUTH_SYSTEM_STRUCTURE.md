# BiashaDrive - Complete Authentication System Structure

## 1. AUTHENTICATION FLOW OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Journey                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User visits app → Auto-redirected to /login              │
│                           ↓                                  │
│  2. Login Page (Phone/OTP)                                   │
│     ├─ Step A: Enter phone number (254XXXXXXXXX)             │
│     │          ↓                                              │
│     │  System sends OTP to phone via SMS                     │
│     │                                                        │
│     └─ Step B: Enter 6-digit OTP code                        │
│                ↓                                              │
│  3. OTP Verification                                         │
│     ├─ Valid OTP → User authenticated                        │
│     ├─ JWT token generated & stored (localStorage)           │
│     └─ User object stored (localStorage)                     │
│                ↓                                              │
│  4. Check if New User                                        │
│     ├─ YES → Redirect to /onboarding                         │
│     └─ NO → Redirect to /dashboard                           │
│                ↓                                              │
│  5. Onboarding (New Users Only)                              │
│     ├─ Step 1: Full Name                                     │
│     ├─ Step 2: Business Name                                 │
│     ├─ Step 3: County Selection                              │
│     ├─ Step 4: Business Sector                               │
│     └─ Step 5: Business Stage (Startup/Growing/Established)  │
│                ↓                                              │
│  6. Profile Created → User Authenticated & Onboarded         │
│     └─ Access to Dashboard, Experts, Diagnostics             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. LOGIN PAGE STRUCTURE (`/login`)

### Mobile-First Design
✅ **Fully responsive** on all screen sizes  
✅ **Single-column layout** on mobile  
✅ **Two-column layout** on desktop with side branding  
✅ **Touch-optimized** buttons and inputs  

### Mobile Experience
```
┌────────────────────────────────────┐
│     BiashaDrive Logo              │  ← Header (50px)
├────────────────────────────────────┤
│                                    │
│   📱 Welcome to BiashaDrive        │  ← Icon + Title
│   "Enter your phone number..."     │  ← Subtitle
│                                    │
│   ┌──────────────────────────────┐ │
│   │ Phone Number                 │ │  ← Input (48px tall)
│   │ [254712345678............]    │ │
│   │ Format: 254XXXXXXXXX         │ │  ← Helper text
│   └──────────────────────────────┘ │
│                                    │
│   ┌──────────────────────────────┐ │
│   │  Send Verification Code ➜    │ │  ← Button (56px tall)
│   └──────────────────────────────┘ │
│                                    │
│   By continuing, you agree to our  │  ← Footer text
│   Terms & Privacy Policy           │
│                                    │
└────────────────────────────────────┘
```

### Desktop Experience (Split Layout)
```
┌────────────────────────────────────────────────────────┐
│ Left Panel (50%)        │ Right Panel (50%)             │
│ =====================  │ ====================          │
│  Dark green gradient    │  Light background             │
│  White branding         │  Form centered                │
│  ✓ Verified experts     │  ┌──────────────────────────┐ │
│  ✓ Expert diagnostics   │  │ Sign In                  │ │
│  ✓ Business playbooks   │  ├──────────────────────────┤ │
│                         │  │ Phone input              │ │
│                         │  │ [254712345678..........]  │ │
│                         │  │                          │ │
│                         │  │ [Send Verification Code]  │ │
│                         │  └──────────────────────────┘ │
│                         │                              │
└────────────────────────────────────────────────────────┘
```

### Key Features
- **Phone Number Validation**: Accepts only 254XXXXXXXXX format
- **Auto-Formatting**: Strips non-numeric characters
- **OTP Generation**: 6-digit numeric code (case-insensitive on frontend)
- **Dev Mode**: Shows OTP on-screen for testing
- **Resend Timer**: 60-second countdown before resend available
- **Error Handling**: Clear, visible error messages
- **Accessibility**: Proper labels, input modes (inputMode="numeric")

---

## 3. ONBOARDING PAGE STRUCTURE (`/onboarding`)

### Multi-Step Form (5 Steps)
✅ **Progressive disclosure** - One question at a time  
✅ **Mobile-optimized** - Full-width inputs on mobile  
✅ **Side image** on desktop showing business photo  
✅ **Progress indicators** - Visual progress bars  

### Step-by-Step Breakdown

#### Step 1: User Name
```
Questions: "What's your name?"
Input: Text field
Example: "Sarah Kipchoge"
Validation: Required, non-empty
Next: → Step 2
Back: N/A (First step)
Progress: ████░░░░░ (20%)
```

#### Step 2: Business Name
```
Questions: "What's your business name?"
Input: Text field
Example: "Sarah's Boutique"
Validation: Required, non-empty
Navigation: Back ← Step 1 | Step 3 →
Progress: ████████░░ (40%)
```

#### Step 3: County
```
Questions: "Which county are you in?"
Input: Dropdown select (16 options)
Options:
  • Nairobi
  • Mombasa
  • Kisumu
  • Nakuru
  • Eldoret
  • Thika
  • Machakos
  • Kiambu
  • Meru
  • Nyeri
  • Kakamega
  • Bungoma
  • Kericho
  • Kitale
  • Garissa
  • Other

Validation: Required selection
Progress: ████████████░ (60%)
```

#### Step 4: Business Sector
```
Questions: "What sector is your business in?"
Input: Dropdown select (10 options)
Options:
  • Retail
  • Food & Beverage
  • Professional Services
  • Technology
  • Agriculture
  • Manufacturing
  • Transport & Logistics
  • Education
  • Healthcare
  • Other

Validation: Required selection
Progress: ████████████████░ (80%)
```

#### Step 5: Business Stage
```
Questions: "What stage is your business at?"
Input: Radio buttons (3 options)

┌─────────────────────────────────────┐
│ ● Startup                           │  ← Selected (filled circle)
│   Just starting or less than 1 year  │
│                                     │
│ ○ Growing                           │  ← Unselected (empty circle)
│   Growing with 1-3 years in business │
│                                     │
│ ○ Established                       │
│   Established with 3+ years         │
└─────────────────────────────────────┘

Validation: Required selection
Final: Submit → Create Profile
Progress: ████████████████████ (100%)
```

### Mobile Layout Example
```
┌────────────────────────────────────────┐
│                                        │
│  📦 Tell Us About Your Business        │
│  Step 1 of 5 - Takes 2 minutes         │
│                                        │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                        │
│  ⚠️ Please enter your name             │ ← Error (if any)
│                                        │
│  What's your name?                     │
│  ┌──────────────────────────────────┐  │
│  │ Enter your name...               │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Continue →                       │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

### Desktop Layout Example
```
┌──────────────────────────────────────────────────────────┐
│ Left (50%)                 │ Right (50%)                  │
│ ========================= │ =======================      │
│ [Biashara Business Image]  │ Progress: 20% 1/5           │
│ (Rounded corners)          │                              │
│ 400x300px                  │ Tell Us About Your Business  │
│                            │ This helps us personalize... │
│ "Tell Us About Your        │                              │
│  Business"                 │ What's your name?            │
│ "Connect with right        │ ┌────────────────────────┐   │
│  experts"                  │ │ Enter your name...     │   │
│                            │ └────────────────────────┘   │
│                            │                              │
│                            │ [Continue →] (Full width)    │
│                            │                              │
└──────────────────────────────────────────────────────────┘
```

### Visual Enhancements
- **Progress bars**: Linear progress on desktop, dot indicators on mobile
- **Animations**: Smooth fade-in (300ms) for each step
- **Button states**:
  - Enabled: Solid color with hover effect
  - Disabled: Faded (50% opacity) and not clickable
- **Input focus states**: 
  - Border color changes to primary
  - Ring shadow added for emphasis
  - Background lightened slightly
- **Image**: Biashara picture (your provided image) displayed on desktop side panel
  - Rounded corners (16px)
  - Box shadow for depth
  - Responsive sizing

---

## 4. AUTHENTICATION API ROUTES

### Send OTP: `POST /api/auth/send-otp`

**Request:**
```json
{
  "phone": "254712345678"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent",
  "devOtp": "123456"  // Only in development mode
}
```

**Response (Error):**
```json
{
  "error": "Invalid phone number",
  "status": 400
}
```

**Backend Logic:**
```
1. Validate phone format (must start with 254, length 12+)
2. Generate random 6-digit code
3. In DEV MODE:
   - Store in memory Map with timestamp
   - Return OTP in response (for testing)
4. In PRODUCTION:
   - Send via Africa's Talking SMS API
   - Store hashed code in database with TTL
5. Return success response
```

### Verify OTP: `POST /api/auth/verify-otp`

**Request:**
```json
{
  "phone": "254712345678",
  "code": "123456"
}
```

**Response (New User):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "phone": "254712345678",
    "name": null,
    "businessName": null,
    "county": null,
    "sector": null,
    "stage": null,
    "language": "en"
  },
  "isNewUser": true
}
```

**Response (Existing User):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "phone": "254712345678",
    "name": "Sarah Kipchoge",
    "businessName": "Sarah's Boutique",
    "county": "Nairobi",
    "sector": "Retail",
    "stage": "growing",
    "language": "en"
  },
  "isNewUser": false
}
```

**Backend Logic:**
```
1. Validate OTP (check against stored code + TTL)
2. Find or create user with phone number
3. Generate JWT token (30-day expiry)
4. Return token + user object + isNewUser flag
5. Frontend stores token in localStorage
```

### Onboarding: `POST /api/auth/onboarding`

**Request (with JWT Bearer token):**
```json
{
  "name": "Sarah Kipchoge",
  "businessName": "Sarah's Boutique",
  "county": "Nairobi",
  "sector": "Retail",
  "stage": "growing"
}
```

**Response:**
```json
{
  "user": {
    "id": "user123",
    "phone": "254712345678",
    "name": "Sarah Kipchoge",
    "businessName": "Sarah's Boutique",
    "county": "Nairobi",
    "sector": "Retail",
    "stage": "growing",
    "language": "en"
  },
  "message": "Profile updated successfully"
}
```

**Backend Logic:**
```
1. Verify JWT token from Authorization header
2. Extract userId from token
3. Update user record with profile data
4. Return updated user object
5. Frontend stores updated user in localStorage
```

---

## 5. JWT TOKEN STRUCTURE

### Token Payload
```json
{
  "userId": "user123",
  "iat": 1702000000,           // Issued at timestamp
  "exp": 1704592000            // Expiration (30 days from issue)
}
```

### Token Usage
- **Stored in**: `localStorage.getItem('token')`
- **Sent as**: `Authorization: Bearer <token>` header
- **Expires**: 30 days from issue
- **Used for**: All authenticated API calls (experts booking, diagnostics, onboarding)

### Token Verification
```typescript
// Example usage in API routes
import { verify } from 'jsonwebtoken';

const token = request.headers.get('authorization')?.substring(7);
const decoded = verify(token, process.env.JWT_SECRET);
const userId = decoded.userId; // Extract user ID
```

---

## 6. LOCAL STORAGE STRUCTURE

### Stored Data After Login
```json
// Token
{
  "key": "token",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// User Object
{
  "key": "user",
  "value": {
    "id": "user123",
    "phone": "254712345678",
    "name": "Sarah Kipchoge",
    "businessName": "Sarah's Boutique",
    "county": "Nairobi",
    "sector": "Retail",
    "stage": "growing",
    "language": "en",
    "createdAt": "2025-12-11T10:00:00Z",
    "updatedAt": "2025-12-11T10:30:00Z"
  }
}
```

### Logout Action
```typescript
// Clear authentication
localStorage.removeItem('token');
localStorage.removeItem('user');
// Redirect to /login
```

---

## 7. PROTECTED ROUTES & MIDDLEWARE

### Public Routes (No Auth Required)
- `/` - Landing page
- `/login` - Login page
- `/api/auth/send-otp` - OTP sending
- `/api/auth/verify-otp` - OTP verification

### Protected Routes (Auth Required)
- `/onboarding` - New user profile setup
- `/dashboard` - User dashboard
- `/experts` - Expert marketplace
- `/experts/[id]` - Expert detail pages
- `/diagnostics` - Diagnostic assessment
- `/admin/*` - Admin panels

### Route Protection Pattern
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <div>Protected content here</div>;
}
```

---

## 8. ERROR HANDLING

### Login Error Scenarios
| Error | Cause | User Message |
|-------|-------|--------------|
| Invalid phone format | Phone doesn't start with 254 | "Please enter a valid Kenya phone number" |
| OTP expired | Code used after 10 minutes | "Code expired, please request a new one" |
| Wrong OTP | Incorrect 6-digit code | "Invalid code, please try again" |
| Rate limit | Too many OTP requests | "Too many attempts, try again later" |
| Network error | API unreachable | "Connection error, please try again" |

### Onboarding Error Scenarios
| Error | Cause | User Message |
|-------|-------|--------------|
| Missing field | Name/county/sector not filled | "Please fill all required fields" |
| Invalid token | JWT expired or invalid | "Session expired, please login again" |
| Network error | Save failed | "Failed to save profile, please retry" |

---

## 9. MOBILE OPTIMIZATION CHECKLIST

✅ **Input Types**
- Phone input: `type="tel"` with `inputMode="numeric"`
- OTP input: `type="text"` with `inputMode="numeric"`
- Text inputs: `type="text"` with appropriate inputMode

✅ **Touch Target Sizes**
- All buttons: Minimum 48px x 48px (44px recommended)
- Input fields: Minimum 48px height
- Spacing between interactive elements: 16px minimum

✅ **Responsive Layout**
- Single column on mobile (100% width)
- Max-width: 24rem (384px) for form containers
- Padding: 16px on mobile, 24px on tablet
- Font sizes: 16px+ on mobile for better readability

✅ **Performance**
- Lazy load images (biashara image)
- Minimize JavaScript on login page
- Cache authentication tokens
- Optimize form re-renders

✅ **Accessibility**
- Proper label associations (`htmlFor`)
- ARIA labels for icons
- Semantic HTML (form, button, input)
- Color contrast ratios (4.5:1 minimum)
- Clear error messages

✅ **UX Enhancements**
- Loading spinners during API calls
- Disabled buttons while loading
- Debounced form submission
- Success/error feedback
- Back button on multi-step forms

---

## 10. DATABASE SCHEMA (Authentication Related)

### User Table
```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  email TEXT,
  name TEXT,                    -- Set during onboarding
  businessName TEXT,            -- Set during onboarding
  county TEXT,                  -- Set during onboarding
  sector TEXT,                  -- Set during onboarding
  stage TEXT,                   -- 'startup', 'growing', 'established'
  language TEXT DEFAULT 'en',   -- 'en' or 'sw'
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

### OTP Storage (In-Memory Dev Mode)
```typescript
// Stored as Map in memory (development only)
interface OTPStore {
  phone: {
    code: string;
    expiresAt: number;
    attempts: number;
  };
}

// Example:
// "254712345678" → { code: "123456", expiresAt: 1702000600000, attempts: 0 }
```

---

## 11. COMPLETE LOGIN FLOW DIAGRAM

```
User Opens App
      ↓
Check localStorage token?
      ├─ NO → Redirect to /login
      └─ YES → Check token validity
                    ├─ Valid → Show dashboard
                    └─ Expired → Redirect to /login
                           ↓
                    /login Page Rendered
                           ↓
                    User enters phone
                           ↓
                    POST /api/auth/send-otp
                           ├─ Success → Show OTP input
                           │              (60 sec countdown)
                           └─ Error → Display error message
                                  ↓
                           User enters 6-digit OTP
                                  ↓
                           POST /api/auth/verify-otp
                                  ├─ Success → Store token & user
                                  │   ├─ isNewUser=true → /onboarding
                                  │   └─ isNewUser=false → /dashboard
                                  └─ Error → Clear OTP, show error
                                         ↓ (Resend available after 60s)
                                      
                    /onboarding Page (New Users)
                           ↓
                    Step 1: Name
                    Step 2: Business Name
                    Step 3: County
                    Step 4: Sector
                    Step 5: Business Stage
                           ↓
                    POST /api/auth/onboarding
                           ├─ Success → Store updated user
                           │   └─ Redirect to /dashboard
                           └─ Error → Display error
                                  
                    Dashboard (Authenticated)
                           ↓
                    User can:
                    • Browse experts
                    • Run diagnostics
                    • View playbooks
                    • Book consultations
```

---

## 12. SECURITY BEST PRACTICES

✅ **Implemented**
- JWT tokens with 30-day expiry
- HTTPS required in production
- Bearer token in Authorization header
- Sensitive data in .env files
- Phone-based authentication (simpler than password)

⏳ **Recommended for Production**
- Rate limiting on OTP requests (max 5 per hour)
- OTP expiry: 10 minutes (currently no expiry in dev)
- HTTPS/TLS encryption
- CORS headers configured
- Input sanitization (SQL injection prevention)
- CSRF protection tokens
- Secure HttpOnly cookies (instead of localStorage)
- Two-factor authentication (SMS + email)
- Session timeout warnings
- Device fingerprinting for anomaly detection

---

## 13. CONFIGURATION

### Environment Variables
```
# Auth secrets
JWT_SECRET="your-secure-random-key-min-32-chars"

# OTP/SMS Services (Future)
AFRICA_TALKING_API_KEY="..."
TWILIO_AUTH_TOKEN="..."

# Database
DATABASE_URL="postgresql://user:pass@host/db"
```

### Constants
```typescript
// src/lib/auth.constants.ts
export const AUTH = {
  JWT_EXPIRY: 30 * 24 * 60 * 60, // 30 days in seconds
  OTP_LENGTH: 6,
  OTP_EXPIRY: 10 * 60 * 1000,    // 10 minutes
  OTP_MAX_ATTEMPTS: 5,
  RESEND_COOLDOWN: 60,            // 60 seconds
  PHONE_FORMAT: /^254\d{9}$/,     // 254 + 9 digits
};
```

---

## Summary: Login System Features

| Feature | Status | Details |
|---------|--------|---------|
| **Mobile-First Design** | ✅ Complete | Fully responsive on all devices |
| **Phone/OTP Auth** | ✅ Complete | 6-digit code, 60s resend cooldown |
| **JWT Tokens** | ✅ Complete | 30-day expiry, localStorage storage |
| **Multi-Step Onboarding** | ✅ Complete | 5 progressive steps with image |
| **Error Handling** | ✅ Complete | Clear user-friendly messages |
| **Input Validation** | ✅ Complete | Phone format, field requirements |
| **Loading States** | ✅ Complete | Spinners, disabled buttons |
| **Route Protection** | ✅ Complete | Token checks on protected pages |
| **Biashara Image Integration** | ✅ Complete | Displayed on onboarding desktop |
| **Accessibility** | ✅ Complete | ARIA labels, semantic HTML |
| **SMS Integration** | ⏳ Ready | Africa's Talking API ready |
| **Email Notifications** | ⏳ Ready | SendGrid integration ready |

---

## Testing the Login Flow

### Step 1: Open Login Page
- Go to `http://localhost:3000/login`
- Should see phone input on mobile, split layout on desktop

### Step 2: Enter Phone Number
- Type: `254712345678`
- Click "Send Verification Code"
- See dev OTP displayed on-screen: `123456`

### Step 3: Enter OTP
- Input the OTP shown on screen
- Click "Verify & Continue"
- If new user: Redirected to `/onboarding`
- If existing user: Redirected to `/dashboard`

### Step 4: Complete Onboarding (New Users)
- Fill 5 steps: name, business, county, sector, stage
- Progress bar fills as you advance
- Click "Get Started!" on final step
- Redirected to dashboard

### Step 5: Verify Authentication
- Check localStorage: `token` and `user` objects present
- Token is JWT format (starts with `eyJ`)
- User object contains all profile fields

---

## Next Steps

1. **Test on Mobile**: Use DevTools device emulation or real phone
2. **Deploy to Vercel**: Push to GitHub, auto-deploy
3. **Enable SMS**: Integrate Africa's Talking API
4. **Monitor Analytics**: Track signup conversion rate
5. **Gather Feedback**: Test with real Kenyan users
