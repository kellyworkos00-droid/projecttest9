const axios = require('axios');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.INFOBIP_API_KEY;
const apiBaseUrl = process.env.INFOBIP_API_URL || 'https://k9dxme.api.infobip.com';
const testPhone = '254700000000'; // Test number

console.log('🧪 Testing Infobip SMS API...');
console.log(`API Base URL: ${apiBaseUrl}`);
console.log(`API Key: ${apiKey ? '✅ Configured' : '❌ Missing'}\n`);

if (!apiKey) {
  console.error('❌ INFOBIP_API_KEY not found in .env.local');
  process.exit(1);
}

async function testSMS() {
  try {
    console.log(`📤 Sending test SMS to ${testPhone}...`);

    const response = await axios.post(
      `${apiBaseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: testPhone }],
            text: `Test from BiashaDrive - Code: 123456`,
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

    console.log('✅ API Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.messages && response.data.messages.length > 0) {
      const msg = response.data.messages[0];
      console.log('\n✅ SMS Details:');
      console.log(`   - Message ID: ${msg.messageId}`);
      console.log(`   - Status: ${msg.status.name} (${msg.status.description})`);
      console.log(`   - Group ID: ${msg.status.groupId}`);
    }
  } catch (error) {
    console.error('❌ SMS API Error:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    } else if (error.request) {
      console.error('   No response received:', error.message);
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

testSMS();
