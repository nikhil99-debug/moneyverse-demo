import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const eventType = payload.type;

  const supabase = createServiceClient();

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = payload.data;
    const email = email_addresses?.[0]?.email_address;
    const displayName = [first_name, last_name].filter(Boolean).join(' ') || 'MoneyMania User';

    // Generate unique referral code
    const referralCode = `MM${id.slice(-6).toUpperCase()}`;

    const { error } = await supabase.from('users').insert({
      clerk_id: id,
      email,
      display_name: displayName,
      avatar_url: image_url,
      referral_code: referralCode,
    });

    if (error) {
      console.error('Error creating user in Supabase:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, first_name, last_name, image_url } = payload.data;
    const displayName = [first_name, last_name].filter(Boolean).join(' ');

    await supabase
      .from('users')
      .update({ display_name: displayName, avatar_url: image_url })
      .eq('clerk_id', id);
  }

  if (eventType === 'user.deleted') {
    const { id } = payload.data;
    await supabase.from('users').delete().eq('clerk_id', id);
  }

  return NextResponse.json({ received: true });
}
