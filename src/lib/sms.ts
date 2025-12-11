import axios from 'axios';

/**
 * Send SMS via Africa's Talking API
 * Get API key from: https://africastalking.com/
 */

interface SendSmsOptions {
  phone: string;
  message: string;
  retries?: number;
}

interface AfricasTalkingResponse {
  SMSMessageData: {
    Message: string;
    Recipients: Array<{
      statusCode: number;
      number: string;
      status: string;
      cost: string;
      messageId: string;
    }>;
  };
}

/**
 * Send OTP via SMS using Africa's Talking
 */
export async function sendOtpSms(
  phone: string,
  otp: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const apiKey = process.env.AFRICASTALKING_API_KEY;
    const username = process.env.AFRICASTALKING_USERNAME || 'sandbox';

    if (!apiKey) {
      console.error('AFRICASTALKING_API_KEY not configured');
      return {
        success: false,
        error: 'SMS service not configured'
      };
    }

    // Format message
    const message = `Your BiashaDrive verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

    // Make API call to Africa's Talking
    const response = await axios.post<AfricasTalkingResponse>(
      'https://api.africastalking.com/version1/messaging',
      {
        username,
        APIkey: apiKey,
        recipients: [
          {
            phoneNumber: phone,
            message: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    const data = response.data;

    // Check if message was sent successfully
    if (
      data.SMSMessageData &&
      data.SMSMessageData.Recipients &&
      data.SMSMessageData.Recipients.length > 0
    ) {
      const recipient = data.SMSMessageData.Recipients[0];

      if (recipient.statusCode === 101) {
        console.log(`OTP sent to ${phone}: ${recipient.messageId}`);
        return {
          success: true,
          messageId: recipient.messageId
        };
      } else {
        console.error(`SMS send failed: ${recipient.status}`);
        return {
          success: false,
          error: recipient.status
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
 * Send WhatsApp message via Africa's Talking
 * Alternative to SMS with better delivery rates
 */
export async function sendWhatsAppOtp(
  phone: string,
  otp: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const apiKey = process.env.AFRICASTALKING_API_KEY;
    const username = process.env.AFRICASTALKING_USERNAME || 'sandbox';

    if (!apiKey) {
      return {
        success: false,
        error: 'WhatsApp service not configured'
      };
    }

    // Format message for WhatsApp
    const message = `Your BiashaDrive verification code is: ${otp}\n\nValid for 10 minutes. Do not share this code.`;

    // Make API call to Africa's Talking WhatsApp API
    const response = await axios.post<AfricasTalkingResponse>(
      'https://api.sandbox.africastalking.com/version1/messaging',
      {
        username,
        APIkey: apiKey,
        recipients: [
          {
            phoneNumber: phone,
            message: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    const data = response.data;

    if (
      data.SMSMessageData &&
      data.SMSMessageData.Recipients &&
      data.SMSMessageData.Recipients.length > 0
    ) {
      const recipient = data.SMSMessageData.Recipients[0];

      if (recipient.statusCode === 101) {
        console.log(`WhatsApp message sent to ${phone}`);
        return {
          success: true,
          messageId: recipient.messageId
        };
      }
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
    
    const apiKey = process.env.AFRICASTALKING_API_KEY;
    const username = process.env.AFRICASTALKING_USERNAME || 'sandbox';

    if (!apiKey) {
      return { success: false, error: 'SMS service not configured' };
    }

    const response = await axios.post<AfricasTalkingResponse>(
      'https://api.africastalking.com/version1/messaging',
      {
        username,
        APIkey: apiKey,
        recipients: [
          {
            phoneNumber: phone,
            message: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    const data = response.data;
    if (
      data.SMSMessageData?.Recipients &&
      data.SMSMessageData.Recipients[0]?.statusCode === 101
    ) {
      return { success: true };
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
    
    const apiKey = process.env.AFRICASTALKING_API_KEY;
    const username = process.env.AFRICASTALKING_USERNAME || 'sandbox';

    if (!apiKey) {
      return { success: false, error: 'SMS service not configured' };
    }

    const response = await axios.post<AfricasTalkingResponse>(
      'https://api.africastalking.com/version1/messaging',
      {
        username,
        APIkey: apiKey,
        recipients: [
          {
            phoneNumber: expertPhone,
            message: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    const data = response.data;
    if (
      data.SMSMessageData?.Recipients &&
      data.SMSMessageData.Recipients[0]?.statusCode === 101
    ) {
      return { success: true };
    }

    return { success: false, error: 'Failed to send expert notification' };
  } catch (error) {
    console.error('Expert notification SMS error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}
