import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Razorpay from 'razorpay';

const PLAN_AMOUNTS: Record<string, number> = {
  monthly: 19900,  // ₹199 in paise
  yearly: 99900,   // ₹999 in paise
  bundle: 149900,  // ₹1499 in paise
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await req.json();
  const amount = PLAN_AMOUNTS[plan];

  if (!amount) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `mm_${userId}_${Date.now()}`,
      notes: { userId, plan },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
