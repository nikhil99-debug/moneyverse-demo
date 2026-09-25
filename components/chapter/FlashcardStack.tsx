'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlashCard } from '@/lib/types';

interface FlashcardStackProps {
  cards: FlashCard[];
  characterColor: string;
  onComplete: () => void;
}

export default function FlashcardStack({ cards, characterColor, onComplete }: FlashcardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;

  const handleNext = () => {
    setIsFlipped(false);
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {cards.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i === currentIndex ? characterColor : 'rgba(255,255,255,0.15)',
              transform: i === currentIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="relative min-h-[280px] rounded-2xl cursor-pointer comic-border overflow-hidden"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              borderColor: `${characterColor}40`,
              background: `linear-gradient(160deg, ${characterColor}10, #141414)`,
            }}
          >
            <div className="p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
              {!isFlipped ? (
                <>
                  <p className="text-xs uppercase tracking-widest mb-4" style={{ color: characterColor }}>
                    Question
                  </p>
                  <p className="text-xl font-bold text-white leading-relaxed">
                    {card.front}
                  </p>
                  <p className="mt-6 text-xs text-white/30">Tap to reveal answer</p>
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-widest mb-4 text-emerald">
                    Answer
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    {card.back}
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {isFlipped && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center mt-6"
        >
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{
              background: characterColor,
              color: '#0a0a0a',
            }}
          >
            {isLast ? 'Continue' : 'Next Card'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
