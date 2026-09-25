'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCharacter } from '@/lib/characters';
import { useAppStore } from '@/stores/useAppStore';
import { calculateQuizXP, XP_VALUES } from '@/lib/xp';
import SectionRenderer from '@/components/chapter/SectionRenderer';
import QuizResults from '@/components/quiz/QuizResults';
import type { ChapterContent, Section } from '@/lib/types';

// Import chapter content
import monetaCh1 from '@/lib/content/moneta/chapter-1.json';

const CONTENT_MAP: Record<string, ChapterContent> = {
  'moneta-1': monetaCh1 as ChapterContent,
};

export default function ChapterPage({
  params,
}: {
  params: Promise<{ character: string; chapter: string }>;
}) {
  const { character: slug, chapter: chapterStr } = use(params);
  const chapterNum = parseInt(chapterStr);
  const character = getCharacter(slug);

  if (!character) notFound();

  const contentKey = `${slug}-${chapterNum}`;
  const content = CONTENT_MAP[contentKey];

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Chapter Coming Soon</h2>
          <p className="text-white/40 mb-6">This chapter content is being crafted.</p>
          <Link
            href={`/learn/${slug}`}
            className="px-6 py-3 rounded-full font-bold text-sm"
            style={{ background: character.color, color: '#0a0a0a' }}
          >
            Back to {character.name}
          </Link>
        </div>
      </div>
    );
  }

  return <ChapterExperience content={content} character={character} />;
}

function ChapterExperience({
  content,
  character,
}: {
  content: ChapterContent;
  character: ReturnType<typeof getCharacter> & {};
}) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [chapterComplete, setChapterComplete] = useState(false);

  const { addXP, markSectionComplete } = useAppStore();

  const sections = content.sections;
  const currentSection = sections[currentSectionIndex];
  const progress = Math.round(((currentSectionIndex + 1) / sections.length) * 100);

  const handleSectionComplete = useCallback(() => {
    const section = sections[currentSectionIndex];
    markSectionComplete(content.character, content.chapter, section.id);

    // Award XP based on section type
    if (section.type === 'flashcard_stack') addXP(XP_VALUES.FLASHCARD_SECTION);
    if (section.type === 'comic_panel') addXP(XP_VALUES.COMIC_PANEL);
    if (section.type === 'interactive') addXP(XP_VALUES.INTERACTIVE_EXERCISE);

    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex((i) => i + 1);
      setQuizQuestionIndex(0);
      setQuizScore(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setChapterComplete(true);
    }
  }, [currentSectionIndex, sections, content, addXP, markSectionComplete]);

  const handleQuizAnswer = useCallback(
    (isCorrect: boolean) => {
      const section = currentSection;
      if (!section.questions) return;

      const newScore = isCorrect ? quizScore + 1 : quizScore;
      setQuizScore(newScore);

      if (quizQuestionIndex < section.questions.length - 1) {
        setTimeout(() => setQuizQuestionIndex((i) => i + 1), 2800);
      } else {
        // Quiz complete
        const xpEarned = calculateQuizXP(newScore, section.questions.length);
        if (xpEarned > 0) addXP(xpEarned);

        setTimeout(() => setShowQuizResults(true), 2800);
      }
    },
    [currentSection, quizQuestionIndex, quizScore, addXP]
  );

  const handleQuizContinue = useCallback(() => {
    setShowQuizResults(false);
    handleSectionComplete();
  }, [handleSectionComplete]);

  if (chapterComplete) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center halftone">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-6"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black mb-2">Chapter Complete!</h1>
          <p className="text-white/50 mb-2">
            {character.name} — {content.title}
          </p>
          <p className="text-sm text-white/30 mb-8">
            Great work! You&apos;ve completed this chapter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/learn/${character.slug}`}
              className="px-6 py-3 rounded-full font-bold text-sm"
              style={{ background: character.color, color: '#0a0a0a' }}
            >
              Back to {character.name}
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-full font-bold text-sm border border-white/20 hover:bg-white/5"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] halftone">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href={`/learn/${character.slug}`}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ✕
          </Link>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: character.color }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <span className="text-xs text-white/30">{progress}%</span>
        </div>
      </div>

      {/* Chapter title */}
      {currentSectionIndex === 0 && (
        <div className="text-center pt-8 pb-4 px-6">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: character.color }}>
            {character.name} — Chapter {content.chapter}
          </p>
          <h1 className="text-3xl font-black">{content.title}</h1>
        </div>
      )}

      {/* Section content */}
      <div className="max-w-lg mx-auto px-6 pb-16">
        <AnimatePresence mode="wait">
          {showQuizResults ? (
            <motion.div
              key="quiz-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuizResults
                score={quizScore}
                totalQuestions={currentSection.questions?.length || 0}
                characterColor={character.color}
                characterName={character.name}
                chapterTitle={content.title}
                onContinue={handleQuizContinue}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`section-${currentSectionIndex}-${quizQuestionIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SectionRenderer
                section={currentSection}
                characterColor={character.color}
                onComplete={handleSectionComplete}
                onQuizAnswer={handleQuizAnswer}
                quizQuestionIndex={quizQuestionIndex}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
