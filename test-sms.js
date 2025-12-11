// Test Infobip SMS API connection
// Run this in your terminal: node test-sms.js

const axios = require('axios');

const apiKey = 'd9e9769f8b6418fc5e30fd8eeb7b4546-a6c961e8-6601-4b2a-ba1d-fa3eaefa1977';
const apiBaseUrl = 'https://k9dxme.api.infobip.com';
const phone = '254712345678'; // Kenya number

async function testSms() {
  console.log('🧪 Testing Infobip SMS API...\n');
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('Phone:', phone);
  console.log('Endpoint:', `${apiBaseUrl}/sms/2/text/advanced\n`);

  try {
    const response = await axios.post(
      `${apiBaseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: phone }],
            text: 'Test SMS from BiashaDrive - Code: 123456',
            from: 'BiashaDrive'
          }
        ]
      },
      {
        headers: {
          'Authorization': `App ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error!');
    if (axios.isAxiosError(error)) {
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testSms();
