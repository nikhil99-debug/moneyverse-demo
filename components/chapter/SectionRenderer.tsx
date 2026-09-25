'use client';

import type { Section } from '@/lib/types';
import FlashcardStack from './FlashcardStack';
import ComicPanel from './ComicPanel';
import FunFact from './FunFact';
import TextSection from './TextSection';
import QuizCard from '@/components/quiz/QuizCard';
import BarterSimulator from '@/components/interactive/BarterSimulator';

interface SectionRendererProps {
  section: Section;
  characterColor: string;
  onComplete: () => void;
  onQuizAnswer?: (isCorrect: boolean) => void;
  quizQuestionIndex?: number;
}

export default function SectionRenderer({
  section,
  characterColor,
  onComplete,
  onQuizAnswer,
  quizQuestionIndex,
}: SectionRendererProps) {
  switch (section.type) {
    case 'flashcard_stack':
      return (
        <FlashcardStack
          cards={section.cards || []}
          characterColor={characterColor}
          onComplete={onComplete}
        />
      );

    case 'comic_panel':
      return (
        <ComicPanel
          panels={section.panels || []}
          characterColor={characterColor}
          onComplete={onComplete}
        />
      );

    case 'fun_fact':
      return (
        <FunFact
          text={section.text || ''}
          emoji={section.emoji}
          characterColor={characterColor}
          onComplete={onComplete}
        />
      );

    case 'text':
      return (
        <TextSection
          title={section.title}
          content={section.content || ''}
          characterColor={characterColor}
          onComplete={onComplete}
        />
      );

    case 'interactive':
      return renderInteractive(section, characterColor, onComplete);

    case 'quiz':
      if (section.questions && onQuizAnswer && quizQuestionIndex !== undefined) {
        const q = section.questions[quizQuestionIndex];
        if (q) {
          return (
            <QuizCard
              question={q}
              questionNumber={quizQuestionIndex + 1}
              totalQuestions={section.questions.length}
              characterColor={characterColor}
              onAnswer={onQuizAnswer}
            />
          );
        }
      }
      return null;

    default:
      return (
        <div className="text-center py-8 text-white/30">
          <p>Unknown section type: {section.type}</p>
          <button onClick={onComplete} className="mt-4 text-sm underline">
            Skip
          </button>
        </div>
      );
  }
}

function renderInteractive(section: Section, characterColor: string, onComplete: () => void) {
  switch (section.component) {
    case 'BarterSimulator':
      return (
        <BarterSimulator
          characterColor={characterColor}
          onComplete={onComplete}
          items={section.props?.items as string[] | undefined}
        />
      );
    default:
      return (
        <div className="w-full max-w-lg mx-auto py-8 text-center">
          <div className="glass-card p-8 rounded-2xl">
            <div className="text-4xl mb-4">🔧</div>
            <p className="text-white/50 text-sm">
              Interactive: {section.component}
            </p>
            <p className="text-white/30 text-xs mt-2">Coming soon</p>
            <button
              onClick={onComplete}
              className="mt-6 px-6 py-2 rounded-full text-sm font-bold"
              style={{
                background: `${characterColor}20`,
                color: characterColor,
                border: `1px solid ${characterColor}30`,
              }}
            >
              Continue
            </button>
          </div>
        </div>
      );
  }
}
