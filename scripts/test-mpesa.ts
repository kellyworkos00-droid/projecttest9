import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMpesaCredentials() {
  try {
    console.log('🧪 Testing M-Pesa Credentials...\n');

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('M-Pesa credentials not found in .env');
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    console.log('📡 Requesting access token from Safaricom...');

    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    console.log('✅ Success! Access token received:\n');
    console.log('Token:', response.data.access_token.substring(0, 20) + '...');
    console.log('Expires in:', response.data.expires_in, 'seconds');
    console.log('\n🎉 Your M-Pesa credentials are valid!\n');
    console.log('You can now accept payments in BiashaDrive.');

    return response.data.access_token;
  } catch (error: any) {
    console.error('❌ Error testing M-Pesa credentials:\n');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testMpesaCredentials();
