import axios from 'axios';

/**
 * Send SMS via Infobip API
 * Get API key from: https://www.infobip.com/
 */

interface SendSmsOptions {
  phone: string;
  message: string;
  retries?: number;
}

interface InfobipResponse {
  messages: Array<{
    to: string;
    status: {
      groupId: number;
      groupName: string;
      id: number;
      name: string;
      description: string;
    };
    messageId: string;
  }>;
}

/**
 * Send OTP via SMS using Infobip
 */
export async function sendOtpSms(
  phone: string,
  otp: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const apiKey = process.env.INFOBIP_API_KEY;
    const apiBaseUrl = process.env.INFOBIP_API_URL || 'https://k9dxme.api.infobip.com';

    if (!apiKey) {
      console.error('INFOBIP_API_KEY not configured');
      return {
        success: false,
        error: 'SMS service not configured'
      };
    }

    // Format message
    const message = `Your BiashaDrive verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

    // Make API call to Infobip
    const response = await axios.post<InfobipResponse>(
      `${apiBaseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: phone }],
            text: message,
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

    const data = response.data;

    // Check if message was sent successfully
    if (data.messages && data.messages.length > 0) {
      const message = data.messages[0];

      // Status code 0 = success, 1 = pending
      if (message.status.groupId === 1 || message.status.groupId === 0) {
        console.log(`✅ OTP sent to ${phone}: ${message.messageId}`);
        return {
          success: true,
          messageId: message.messageId
        };
      } else {
        console.error(`SMS send failed: ${message.status.description}`);
        return {
          success: false,
          error: message.status.description
        };
      }
    }

    return {
      success: false,
      error: 'Unexpected API response'
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: false,
      error: 'Failed to send SMS'
    };
  }
}

/**
 * Send WhatsApp message via Infobip
 * Alternative to SMS with better delivery rates
 */
export async function sendWhatsAppOtp(
  phone: string,
  otp: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const apiKey = process.env.INFOBIP_API_KEY;
    const apiBaseUrl = process.env.INFOBIP_API_URL || 'https://k9dxme.api.infobip.com';

    if (!apiKey) {
      return {
        success: false,
        error: 'WhatsApp service not configured'
      };
    }

    // Format message for WhatsApp
    const message = `Your BiashaDrive verification code is: ${otp}\n\nValid for 10 minutes. Do not share this code.`;

    // Make API call to Infobip WhatsApp API
    const response = await axios.post<InfobipResponse>(
      `${apiBaseUrl}/whatsapp/1/message/text`,
      {
        to: phone,
        text: message,
        from: '1'
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

    const data = response.data;

    if (data.messages && data.messages.length > 0) {
      const message = data.messages[0];
      console.log(`✅ WhatsApp message sent to ${phone}: ${message.messageId}`);
      return {
        success: true,
        messageId: message.messageId
      };
    }

    return {
      success: false,
      error: 'Failed to send WhatsApp message'
    };
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    return {
      success: false,
      error: 'Failed to send WhatsApp message'
    };
  }
}

/**
 * Send SMS with fallback to WhatsApp
 */
export async function sendVerificationCode(
  phone: string,
  otp: string
): Promise<{ success: boolean; method: 'sms' | 'whatsapp' | 'none'; error?: string }> {
  // Try SMS first
  const smsResult = await sendOtpSms(phone, otp);
  if (smsResult.success) {
    return {
      success: true,
      method: 'sms'
    };
  }

  // Fallback to WhatsApp
  console.log('SMS failed, attempting WhatsApp...');
  const whatsappResult = await sendWhatsAppOtp(phone, otp);
  if (whatsappResult.success) {
    return {
      success: true,
      method: 'whatsapp'
    };
  }

  // Both failed
  return {
    success: false,
    method: 'none',
    error: 'Could not send verification code'
  };
}

/**
 * Send booking confirmation SMS
 */
export async function sendBookingConfirmationSms(
  phone: string,
  expertName: string,
  amount: number,
  receiptNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const message = `Booking confirmed! Expert: ${expertName}, Amount: KES ${amount}, Receipt: ${receiptNumber}. Thank you for using BiashaDrive!`;
    
    const apiKey = process.env.INFOBIP_API_KEY;
    const apiBaseUrl = process.env.INFOBIP_API_URL || 'https://k9dxme.api.infobip.com';

    if (!apiKey) {
      return { success: false, error: 'SMS service not configured' };
    }

    const response = await axios.post<InfobipResponse>(
      `${apiBaseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: phone }],
            text: message,
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

    const data = response.data;
    if (data.messages && data.messages.length > 0) {
      const msg = data.messages[0];
      if (msg.status.groupId === 1 || msg.status.groupId === 0) {
        return { success: true };
      }
    }

    return { success: false, error: 'Failed to send confirmation SMS' };
  } catch (error) {
    console.error('Booking confirmation SMS error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}

/**
 * Send expert notification SMS
 */
export async function sendExpertNotificationSms(
  expertPhone: string,
  userName: string,
  serviceType: string,
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const message = `New booking! Client: ${userName}, Service: ${serviceType}. Review at BiashaDrive app. Booking ID: ${bookingId}`;
    
    const apiKey = process.env.INFOBIP_API_KEY;
    const apiBaseUrl = process.env.INFOBIP_API_URL || 'https://k9dxme.api.infobip.com';

    if (!apiKey) {
      return { success: false, error: 'SMS service not configured' };
    }

    const response = await axios.post<InfobipResponse>(
      `${apiBaseUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [{ to: expertPhone }],
            text: message,
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

    const data = response.data;
    if (data.messages && data.messages.length > 0) {
      const msg = data.messages[0];
      if (msg.status.groupId === 1 || msg.status.groupId === 0) {
        return { success: true };
      }
    }

    return { success: false, error: 'Failed to send expert notification' };
  } catch (error) {
    console.error('Expert notification SMS error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}
