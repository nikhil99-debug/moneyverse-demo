import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { data: progress } = await supabase
    .from('chapter_progress')
    .select('*')
    .eq('user_id', user.id);

  return NextResponse.json({ progress: progress || [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { characterSlug, chapterNumber, sectionId, quizScore } = await req.json();

  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if progress record exists
  const { data: existing } = await supabase
    .from('chapter_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('character_slug', characterSlug)
    .eq('chapter_number', chapterNumber)
    .single();

  if (existing) {
    const updates: Record<string, unknown> = {};

    if (sectionId) {
      const completed = existing.sections_completed || [];
      if (!completed.includes(sectionId)) {
        updates.sections_completed = [...completed, sectionId];
      }
    }

    if (quizScore !== undefined) {
      updates.quiz_score = quizScore;
      updates.quiz_attempts = (existing.quiz_attempts || 0) + 1;
      updates.completed_at = new Date().toISOString();
    }

    if (Object.keys(updates).length > 0) {
      await supabase
        .from('chapter_progress')
        .update(updates)
        .eq('id', existing.id);
    }
  } else {
    await supabase.from('chapter_progress').insert({
      user_id: user.id,
      character_slug: characterSlug,
      chapter_number: chapterNumber,
      sections_completed: sectionId ? [sectionId] : [],
      quiz_score: quizScore ?? null,
      quiz_attempts: quizScore !== undefined ? 1 : 0,
      completed_at: quizScore !== undefined ? new Date().toISOString() : null,
    });
  }

  return NextResponse.json({ success: true });
}
