'use client';

import { motion } from 'framer-motion';

interface TextSectionProps {
  title?: string;
  content: string;
  characterColor: string;
  onComplete: () => void;
}

export default function TextSection({ title, content, characterColor, onComplete }: TextSectionProps) {
  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl p-8 glass-card"
        style={{ borderColor: `${characterColor}20` }}
      >
        {title && (
          <h3 className="text-xl font-bold mb-4" style={{ color: characterColor }}>
            {title}
          </h3>
        )}
        <div className="text-white/70 leading-relaxed whitespace-pre-line">
          {content}
        </div>
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
