import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('M-Pesa Callback:', JSON.stringify(body, null, 2));

    const { Body } = body;
    
    if (!Body?.stkCallback) {
      return NextResponse.json({ success: true });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } =
      Body.stkCallback;

    // Find transaction
    const transaction = await prisma.transaction.findFirst({
      where: { mpesaCheckoutRequestId: CheckoutRequestID },
    });

    if (!transaction) {
      console.log('Transaction not found for CheckoutRequestID:', CheckoutRequestID);
      return NextResponse.json({ success: true });
    }

    // Update transaction based on result
    if (ResultCode === 0) {
      // Success
      const metadata = CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'completed',
          mpesaReceiptNumber,
          metadata: CallbackMetadata,
        },
      });

      // Update booking if exists
      if (transaction.booking) {
        await prisma.booking.update({
          where: { transactionId: transaction.id },
          data: { status: 'confirmed' },
        });
      }
    } else {
      // Failed
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'failed',
          metadata: { ResultCode, ResultDesc },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return NextResponse.json({ success: true }); // Always return 200 to M-Pesa
  }
}
