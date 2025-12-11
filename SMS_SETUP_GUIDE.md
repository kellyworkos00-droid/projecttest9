# SMS Verification Code Setup Guide

## 🚀 IMPLEMENTATION OVERVIEW

BiashaDrive now supports **automatic SMS verification code sending** via Africa's Talking API with WhatsApp fallback.

### Features
✅ OTP generation (6-digit codes)  
✅ SMS sending via Africa's Talking  
✅ WhatsApp fallback (if SMS fails)  
✅ Rate limiting (max 5 OTP requests per hour)  
✅ 10-minute code expiry  
✅ Development mode (shows OTP on-screen)  
✅ Production ready  
✅ Error logging and monitoring  

---

## 📋 SETUP INSTRUCTIONS

### Step 1: Create Africa's Talking Account

1. Go to **https://africastalking.com/**
2. Click "Sign Up" → Create free account
3. Verify email address
4. **Dashboard** → Copy API Key and Username

### Step 2: Configure Environment Variables

Create or update `.env.local` file with:

```bash
# Africa's Talking SMS API
AFRICASTALKING_API_KEY=your_api_key_here
AFRICASTALKING_USERNAME=your_username_here

# App environment
NODE_ENV=development  # or production
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production
```

**In Vercel Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `AFRICASTALKING_API_KEY` = your API key
   - `AFRICASTALKING_USERNAME` = your username
   - Deploy changes

### Step 3: Install Dependencies

```bash
npm install axios
# axios is already in your dependencies, no additional install needed
```

---

## 📱 HOW IT WORKS

### SMS Sending Flow

```
User enters phone number (254712345678)
           ↓
POST /api/auth/send-otp
           ↓
Generate 6-digit OTP (e.g., 123456)
           ↓
Store in memory with 10-minute expiry
           ↓
Send to Africa's Talking API
           ↓
┌─────────────────────────────────┐
│ SMS Success?                    │
├─────────────────────────────────┤
│ YES → Send SMS to user          │
│      "Your code is: 123456"     │
│                                 │
│ NO → Try WhatsApp fallback      │
│      If WhatsApp fails too:     │
│      Return error (ask retry)   │
└─────────────────────────────────┘
           ↓
Return to frontend:
{
  "success": true,
  "message": "Code sent via SMS",
  "method": "sms"
}
```

### OTP Verification Flow

```
User receives SMS with code
           ↓
User enters code in app
           ↓
POST /api/auth/verify-otp
           ↓
Check if code exists in store
           ↓
Check if code expired (10 minutes)
           ↓
Check if code matches
           ↓
┌─────────────────────────────────┐
│ All checks pass?                │
├─────────────────────────────────┤
│ YES → Delete OTP from store     │
│      Create/find user           │
│      Generate JWT token         │
│      Return user object         │
│                                 │
│ NO → Return error message       │
│      User can request new code  │
└─────────────────────────────────┘
           ↓
Frontend stores JWT token
Redirects to /onboarding or /dashboard
```

---

## 📞 API ENDPOINTS

### Send OTP: `POST /api/auth/send-otp`

**Request:**
```json
{
  "phone": "254712345678"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent to 254712345678",
  "method": "sms",
  "devOtp": "123456"  // Only in development mode
}
```

**Development Mode Response (NODE_ENV=development):**
```json
{
  "success": true,
  "message": "OTP sent via sms",
  "devOtp": "123456"  // Shows OTP on-screen for testing
}
```

**SMS Unavailable (Dev Mode):**
```json
{
  "success": true,
  "message": "OTP sent (dev mode - SMS service unavailable)",
  "devOtp": "123456",
  "warning": "SMS service unavailable - using dev mode"
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Invalid phone number | Phone format is wrong |
| 429 | Too many OTP requests | > 5 requests in 1 hour |
| 500 | Failed to send OTP | API unavailable |

---

### Verify OTP: `POST /api/auth/verify-otp`

**Request:**
```json
{
  "phone": "254712345678",
  "code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clp1234567890",
    "phone": "254712345678",
    "name": null,
    "businessName": null,
    "county": null,
    "sector": null,
    "stage": null,
    "email": null,
    "whatsapp": "254712345678",
    "language": "en"
  },
  "isNewUser": true
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Invalid verification code | Code doesn't match |
| 400 | Code expired | > 10 minutes |
| 400 | No code found | User didn't request OTP |
| 500 | Failed to verify | Database error |

---

## 🧪 TESTING SMS SENDING

### Development Mode (Recommended for Testing)

With `NODE_ENV=development`, the OTP is displayed on-screen:

```
1. Open /login page
2. Enter phone: 254712345678
3. Click "Send Verification Code"
4. See OTP displayed: "123456"
5. Enter OTP in next screen
6. Done!
```

**Advantages:**
- No SMS actually sent (save credits)
- OTP visible immediately
- Test offline (no internet required)
- Perfect for development

### Production Mode (Real SMS)

With `NODE_ENV=production` and API key configured:

```
1. User enters phone: 254712345678
2. OTP generated: 123456
3. SMS sent via Africa's Talking:
   "Your BiashaDrive verification code is: 123456"
4. User receives SMS on their phone
5. User enters code in app
6. Verified!
```

---

## 🔧 CUSTOMIZATION

### Change OTP Expiry Time

In `src/app/api/auth/send-otp/route.ts`:

```typescript
// Current: 10 minutes
const expires = Date.now() + 10 * 60 * 1000;

// Change to 5 minutes:
const expires = Date.now() + 5 * 60 * 1000;

// Change to 15 minutes:
const expires = Date.now() + 15 * 60 * 1000;
```

### Change Rate Limit

In `src/app/api/auth/send-otp/route.ts`:

```typescript
// Current: 5 requests per hour
const MAX_OTP_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Change to 3 requests per 30 minutes:
const MAX_OTP_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes
```

### Customize SMS Message

In `src/lib/sms.ts`, `sendOtpSms()` function:

```typescript
// Current:
const message = `Your BiashaDrive verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

// Customize to your needs:
const message = `🔐 BiashaDrive Code: ${otp}. Valid 10 min. Don't share.`;
```

### Add Email Backup

Extend `sendVerificationCode()` to also send email:

```typescript
export async function sendVerificationCode(
  phone: string,
  otp: string,
  email?: string
): Promise<{ success: boolean; method: 'sms' | 'whatsapp' | 'email' | 'none' }> {
  // Try SMS first
  const smsResult = await sendOtpSms(phone, otp);
  if (smsResult.success) {
    return { success: true, method: 'sms' };
  }

  // Try WhatsApp
  const whatsappResult = await sendWhatsAppOtp(phone, otp);
  if (whatsappResult.success) {
    return { success: true, method: 'whatsapp' };
  }

  // Try Email if available
  if (email) {
    const emailResult = await sendOtpEmail(email, otp);
    if (emailResult.success) {
      return { success: true, method: 'email' };
    }
  }

  return { success: false, method: 'none' };
}
```

---

## 📊 SMS PRICING (Africa's Talking)

### Free Tier
- **Daily limit**: 100 SMS/day
- **Cost**: Free
- **Perfect for**: Development/testing

### Paid Tiers
- **Pay-as-you-go**: KES 0.50 - 1.00 per SMS
- **Volume discounts**: Available for 1000+ SMS/day
- **Billing**: Per SMS actually sent

**Estimate for BiashaDrive:**
- 100 users/day × 1 OTP = 100 SMS = ~KES 50-100/day
- 1,000 users/day × 1 OTP = 1,000 SMS = ~KES 500-1,000/day

---

## 🔐 SECURITY CONSIDERATIONS

### Current Implementation
✅ Rate limiting (5 requests/hour per phone)  
✅ OTP expiry (10 minutes)  
✅ OTP length (6 digits = 1,000,000 possibilities)  
✅ No OTP re-use (deleted after verification)  
✅ HTTPS in production  
✅ JWT tokens (30-day expiry)  

### Production Recommendations
- 🔒 Increase rate limit cooldown (60 minutes between requests)
- 🔒 Log all authentication attempts
- 🔒 Monitor failed verification attempts (>3 = suspicious)
- 🔒 Add IP-based rate limiting (prevent spam)
- 🔒 Email alerts for unusual activity
- 🔒 Use environment variables for secrets (never hardcode)
- 🔒 Enable HTTPS everywhere
- 🔒 Consider 2-factor authentication (SMS + email)

---

## 🧠 SMS SERVICE COMPARISON

### Africa's Talking (Current)
| Feature | Status |
|---------|--------|
| SMS sending | ✅ Yes |
| WhatsApp sending | ✅ Yes |
| Voice calls | ✅ Yes |
| USSD | ✅ Yes |
| Kenya support | ✅ Excellent |
| Pricing | ✅ Cheap (KES 0.50/SMS) |
| Documentation | ✅ Good |
| Free tier | ✅ 100/day |

### Twilio (Alternative)
| Feature | Status |
|---------|--------|
| SMS sending | ✅ Yes |
| WhatsApp sending | ✅ Yes |
| Voice calls | ✅ Yes |
| Kenya support | ✅ Good |
| Pricing | ❌ Expensive ($0.0075/SMS) |
| Documentation | ✅ Excellent |
| Free tier | ⚠️ Limited |

### AWS SNS (Alternative)
| Feature | Status |
|--------|--------|
| SMS sending | ✅ Yes |
| WhatsApp sending | ❌ No |
| Kenya support | ✅ Good |
| Pricing | ❌ Expensive |
| Documentation | ✅ Excellent |
| Free tier | ⚠️ Limited |

**Recommendation**: Africa's Talking is best for Kenyan users (cheaper, optimized for Africa)

---

## 🚨 TROUBLESHOOTING

### Issue: "SMS service not configured"

**Solution**: Check environment variables
```bash
# In terminal, verify:
echo $AFRICASTALKING_API_KEY
echo $AFRICASTALKING_USERNAME

# Should output your credentials
# If empty, add to .env.local and restart dev server
```

### Issue: SMS not received after 5 minutes

**Solutions**:
1. Check phone number format (254XXXXXXXXX)
2. Verify account has credits (Africa's Talking dashboard)
3. Check SMS logs in Africa's Talking dashboard
4. Try WhatsApp instead (might have better delivery)
5. Ensure phone is registered with telecom

### Issue: "Too many OTP requests" error

**Solution**: Wait 1 hour or check Africa's Talking rate limits
```bash
# Current rate limit: 5 requests per phone per hour
# Reset happens automatically after 1 hour
```

### Issue: "Invalid OTP" after entering correct code

**Causes**:
- OTP expired (> 10 minutes)
- Typo in code entry
- OTP used twice (already deleted after first verification)

**Solution**: Request new OTP and verify within 10 minutes

### Issue: WhatsApp fallback not working

**Solution**: 
1. Ensure phone has WhatsApp installed
2. Check Africa's Talking WhatsApp configuration
3. May need WhatsApp Business API registration
4. For now, SMS is primary (fallback is secondary)

---

## 📈 MONITORING & ANALYTICS

### Key Metrics to Track

```typescript
// In /api/auth/send-otp:
- OTP requests per day
- Success vs failure rate
- Rate limit hits
- SMS vs WhatsApp usage
- Average response time

// In /api/auth/verify-otp:
- Verification success rate
- Failed attempts per user
- OTP expiry rate
- JWT token generation time
```

### Example Log Format

```
📱 OTP generated for 254712345678: 123456 (Expires in 10 minutes)
✅ OTP sent via SMS to 254712345678
🔐 JWT token generated for clp1234567890
✅ OTP verified for 254712345678
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [x] Africa's Talking API integration
- [x] SMS sending function
- [x] WhatsApp fallback
- [x] OTP generation (6 digits)
- [x] OTP storage with expiry (10 minutes)
- [x] Rate limiting (5/hour)
- [x] Development mode (display OTP)
- [x] Error handling & logging
- [x] JWT token generation
- [x] Database user creation
- [x] Production ready
- [ ] Set up Africa's Talking account (user's task)
- [ ] Configure .env variables (user's task)
- [ ] Deploy to Vercel (user's task)
- [ ] Test with real phone numbers (user's task)
- [ ] Monitor SMS delivery in production (ongoing)

---

## 🚀 NEXT STEPS

1. **Create Africa's Talking Account**
   - Sign up at https://africastalking.com
   - Get API key and username
   - Add to .env.local

2. **Test in Development Mode**
   - `NODE_ENV=development` is default
   - OTP shows on-screen
   - No SMS actually sent (save credits)

3. **Deploy to Vercel**
   - Add env variables to Vercel dashboard
   - Deploy code
   - Test with real phone numbers

4. **Monitor Production**
   - Check Africa's Talking dashboard for SMS stats
   - Monitor failed verifications
   - Alert on high failure rates

5. **Optimize Based on Data**
   - Adjust OTP expiry if needed
   - Increase/decrease rate limits
   - Add more fallback options (email, voice call)

---

## 📚 RELATED FILES

- **`src/lib/sms.ts`** - SMS sending utilities
- **`src/app/api/auth/send-otp/route.ts`** - OTP generation & SMS API
- **`src/app/api/auth/verify-otp/route.ts`** - OTP verification
- **`.env.example`** - Environment variable template
- **`.env.local`** - Your local configuration (gitignored)

---

## 📞 SUPPORT

For issues:
1. Check troubleshooting section above
2. Review Africa's Talking logs: https://africastalking.com/dashboard
3. Check console logs: `npm run dev` and watch terminal
4. Test with development mode first (OTP on-screen)
5. Verify environment variables are set correctly

---

**Status**: ✅ SMS system fully implemented and ready to use  
**Last Updated**: December 11, 2025  
**API**: Africa's Talking (Recommended for Kenya)  
**Cost**: Free (100/day) or ~KES 0.50/SMS in production  
