import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all-time';
  const limit = parseInt(searchParams.get('limit') || '20');

  const supabase = createServiceClient();

  const { data: users } = await supabase
    .from('users')
    .select('display_name, avatar_url, xp, level, streak_count')
    .order('xp', { ascending: false })
    .limit(limit);

  return NextResponse.json({
    type,
    leaderboard: users || [],
  });
}
