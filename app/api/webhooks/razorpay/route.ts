import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  // Verify webhook signature
  if (signature) {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  const payload = JSON.parse(body);
  const event = payload.event;

  if (event === 'payment.captured') {
    const payment = payload.payload.payment.entity;
    const { userId, plan } = payment.notes || {};

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate expiry
    const now = new Date();
    const expiresAt = new Date(now);
    if (plan === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Update user to Pro
    await supabase
      .from('users')
      .update({
        is_pro: true,
        pro_plan: plan,
        pro_expires_at: expiresAt.toISOString(),
      })
      .eq('id', user.id);

    // Log payment
    await supabase.from('payments').insert({
      user_id: user.id,
      razorpay_order_id: payment.order_id,
      razorpay_payment_id: payment.id,
      amount: payment.amount,
      plan,
      status: 'captured',
    });
  }

  return NextResponse.json({ received: true });
}
