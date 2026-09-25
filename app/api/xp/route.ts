import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';
import { getLevelForXP } from '@/lib/xp';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, reason, metadata } = await req.json();

  if (!amount || !reason) {
    return NextResponse.json({ error: 'Missing amount or reason' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Get current user
  const { data: user } = await supabase
    .from('users')
    .select('id, xp, level')
    .eq('clerk_id', userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const newXP = user.xp + amount;
  const newLevel = getLevelForXP(newXP);

  // Update user XP and level
  await supabase
    .from('users')
    .update({ xp: newXP, level: newLevel.level })
    .eq('id', user.id);

  // Log XP transaction
  await supabase.from('xp_transactions').insert({
    user_id: user.id,
    amount,
    reason,
    metadata,
  });

  return NextResponse.json({
    xp: newXP,
    level: newLevel.level,
    levelTitle: newLevel.title,
    leveledUp: newLevel.level > user.level,
  });
}
