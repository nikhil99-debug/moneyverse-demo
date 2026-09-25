'use client';

import { motion } from 'framer-motion';
import { calculateQuizXP } from '@/lib/xp';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  characterColor: string;
  characterName: string;
  chapterTitle: string;
  onContinue: () => void;
}

export default function QuizResults({
  score,
  totalQuestions,
  characterColor,
  characterName,
  chapterTitle,
  onContinue,
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const xpEarned = calculateQuizXP(score, totalQuestions);
  const passed = percentage >= 60;

  return (
    <div className="w-full max-w-lg mx-auto py-8 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {/* Score circle */}
        <div
          className="w-32 h-32 rounded-full mx-auto flex items-center justify-center comic-border"
          style={{
            borderColor: passed ? '#2ecc71' : '#e74c3c',
            background: passed ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
          }}
        >
          <div>
            <div className="text-3xl font-black" style={{ color: passed ? '#2ecc71' : '#e74c3c' }}>
              {score}/{totalQuestions}
            </div>
            <div className="text-xs text-white/40">{percentage}%</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <h2 className="text-2xl font-black">
          {percentage === 100
            ? 'PERFECT SCORE!'
            : passed
            ? 'Quiz Passed!'
            : 'Keep Learning!'}
        </h2>
        <p className="text-sm text-white/40 mt-2">
          {characterName} — {chapterTitle}
        </p>
      </motion.div>

      {/* XP Earned */}
      {xpEarned > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full"
          style={{
            background: `${characterColor}15`,
            border: `1px solid ${characterColor}30`,
          }}
        >
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-black" style={{ color: characterColor }}>
            +{xpEarned} XP
          </span>
        </motion.div>
      )}

      {!passed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-sm text-white/40"
        >
          Score 60% or higher to earn XP. You can retry!
        </motion.p>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
          style={{ background: characterColor, color: '#0a0a0a' }}
        >
          {passed ? 'Continue' : 'Retry Quiz'}
        </button>
      </motion.div>
    </div>
  );
}
