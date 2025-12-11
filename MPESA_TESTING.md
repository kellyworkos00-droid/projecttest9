# M-Pesa Payment Testing Guide

## ✅ Status: M-Pesa Credentials Validated

Your Safaricom Daraja API credentials are **active and working**!

---

## 🧪 Test Payment Flow (Sandbox)

### Step 1: Start Your App
```bash
npm run dev
```

### Step 2: Login & Book an Expert
1. Go to http://localhost:3001/login
2. Login with phone: `254712345678`
3. Complete onboarding
4. Visit `/experts`
5. Click on any expert → Fill booking form

### Step 3: Initiate Payment

Use these **Safaricom test phone numbers** for sandbox:
- `254708374149`
- `254712345678`
- `254711111111`

**Form values:**
- Service: "Tax Consultation"
- Message: "Need help with KRA filing"
- Amount: 5000 (or any amount)

Click **"Pay with M-Pesa"**

### Step 4: What Happens

**Sandbox Mode (No Real Money):**
1. ✅ Booking created in database
2. ✅ Transaction record created
3. ✅ M-Pesa STK Push initiated
4. 📱 You'll see a simulated M-Pesa prompt (sandbox)
5. ✅ Payment confirmation sent to callback
6. ✅ Booking status updated to "confirmed"

---

## 📱 Testing with Real Phone (Sandbox)

**Important:** Sandbox uses **fake money** - no real charges!

1. Use a **real Kenyan phone number** (254...)
2. When booking, the app will:
   - Send STK Push request to Safaricom
   - You'll get a **simulated** M-Pesa popup on your phone
   - Enter any 4-digit PIN (sandbox accepts anything)
3. Payment processes immediately
4. Callback updates your database

---

## 🔧 Troubleshooting

### "Invalid Access Token"
- Run: `npx ts-node scripts/test-mpesa.ts`
- Should show: ✅ Success! Token received

### "Request failed with 500"
- Check `.env` file has all 5 credentials
- Restart dev server: `npm run dev`

### Callback Not Working
- Callback URL must be **HTTPS and public**
- For local testing, use **Ngrok**:
  ```bash
  ngrok http 3001
  ```
- Update `MPESA_CALLBACK_URL` in `.env` to ngrok URL

---

## 🚀 Production Setup

When ready for real payments:

1. **Apply for Production Credentials** on Daraja
2. **Replace** sandbox credentials in `.env`
3. **Change API URLs** from `sandbox.safaricom.co.ke` to `api.safaricom.co.ke`
4. **Deploy** to Vercel/production
5. **Update** callback URL to production domain

---

## 📊 Monitor Payments

View all transactions in database:
```bash
npx prisma studio
```

Navigate to `Transaction` table to see:
- Payment status (pending/completed/failed)
- M-Pesa receipt numbers
- Amounts and timestamps

---

## 🎯 Current Credentials

```
Environment: Sandbox (Test Mode)
Consumer Key: Atapm6iJ...
Shortcode: 174379
Status: ✅ Active
```

**You're ready to accept payments!** 💰
