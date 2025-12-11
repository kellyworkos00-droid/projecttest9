import { NextResponse } from 'next/server';
import axios from 'axios';

interface MpesaSTKPushRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

async function getMpesaAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
}

export async function POST(request: Request) {
  try {
    const { amount, phoneNumber, accountReference, transactionDesc }: MpesaSTKPushRequest =
      await request.json();

    if (!amount || !phoneNumber || !accountReference) {
      return NextResponse.json(
        { error: 'Amount, phone number, and account reference required' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getMpesaAccessToken();

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14);

    // Generate password
    const shortcode = process.env.MPESA_SHORTCODE || '';
    const passkey = process.env.MPESA_PASSKEY || '';
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    // STK Push request
    const stkPushResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc || 'Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      checkoutRequestId: stkPushResponse.data.CheckoutRequestID,
      merchantRequestId: stkPushResponse.data.MerchantRequestID,
      responseCode: stkPushResponse.data.ResponseCode,
      responseDescription: stkPushResponse.data.ResponseDescription,
    });
  } catch (error: any) {
    console.error('M-Pesa STK Push error:', error.response?.data || error);
    return NextResponse.json(
      { 
        error: 'Failed to initiate payment',
        details: error.response?.data 
      },
      { status: 500 }
    );
  }
}
