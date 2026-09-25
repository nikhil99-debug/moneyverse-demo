import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';
import { isStreakActive, getStreakBonusXP } from '@/lib/streak';

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from('users')
    .select('id, streak_count, longest_streak, last_active_date')
    .eq('clerk_id', userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const today = new Date().toISOString().split('T')[0];

  // Already logged today
  if (user.last_active_date === today) {
    return NextResponse.json({
      streakCount: user.streak_count,
      bonusXP: 0,
      alreadyLogged: true,
    });
  }

  let newStreak = 1;
  if (isStreakActive(user.last_active_date)) {
    newStreak = user.streak_count + 1;
  }

  const longestStreak = Math.max(newStreak, user.longest_streak);
  const bonusXP = getStreakBonusXP(newStreak);

  await supabase
    .from('users')
    .update({
      streak_count: newStreak,
      longest_streak: longestStreak,
      last_active_date: today,
    })
    .eq('id', user.id);

  // Log daily activity
  await supabase.from('daily_activity').upsert({
    user_id: user.id,
    activity_date: today,
    actions: [{ type: 'login', timestamp: new Date().toISOString() }],
  }, { onConflict: 'user_id,activity_date' });

  return NextResponse.json({
    streakCount: newStreak,
    longestStreak,
    bonusXP,
    alreadyLogged: false,
  });
}
