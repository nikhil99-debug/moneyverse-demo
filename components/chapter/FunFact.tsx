'use client';

import { motion } from 'framer-motion';

interface FunFactProps {
  text: string;
  emoji?: string;
  characterColor: string;
  onComplete: () => void;
}

export default function FunFact({ text, emoji, characterColor, onComplete }: FunFactProps) {
  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="rounded-2xl p-8 comic-border text-center"
        style={{
          borderColor: `${characterColor}40`,
          background: `linear-gradient(160deg, ${characterColor}10, #141414)`,
        }}
      >
        <div className="text-4xl mb-4">{emoji || '💡'}</div>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: characterColor }}>
          Fun Fact
        </p>
        <p className="text-lg text-white/80 leading-relaxed font-medium">
          {text}
        </p>
      </motion.div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onComplete}
          className="px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
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
