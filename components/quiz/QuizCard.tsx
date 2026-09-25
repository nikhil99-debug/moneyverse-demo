'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '@/lib/types';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  characterColor: string;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  characterColor,
  onAnswer,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    setTimeout(() => {
      onAnswer(index === question.correct);
    }, 2500);
  };

  const isCorrect = selected === question.correct;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-white/40">
          Question {questionNumber}/{totalQuestions}
        </span>
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: characterColor }}
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, i) => {
            let bgColor = 'rgba(255,255,255,0.05)';
            let borderColor = 'rgba(255,255,255,0.1)';
            let textColor = 'rgba(255,255,255,0.8)';

            if (showResult) {
              if (i === question.correct) {
                bgColor = 'rgba(46,204,113,0.15)';
                borderColor = '#2ecc71';
                textColor = '#2ecc71';
              } else if (i === selected && !isCorrect) {
                bgColor = 'rgba(231,76,60,0.15)';
                borderColor = '#e74c3c';
                textColor = '#e74c3c';
              }
            } else if (i === selected) {
              bgColor = `${characterColor}15`;
              borderColor = characterColor;
            }

            return (
              <motion.button
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className="w-full text-left p-4 rounded-xl transition-all border"
                style={{ background: bgColor, borderColor, color: textColor }}
              >
                <span className="font-medium">{option}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-6 p-4 rounded-xl"
            style={{
              background: isCorrect ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
              border: `1px solid ${isCorrect ? '#2ecc7130' : '#e74c3c30'}`,
            }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: isCorrect ? '#2ecc71' : '#e74c3c' }}>
              {isCorrect ? 'Correct!' : 'Not quite!'}
            </p>
            <p className="text-sm text-white/60">{question.explanation}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
