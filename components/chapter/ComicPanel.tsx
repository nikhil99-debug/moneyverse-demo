'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ComicPanelData } from '@/lib/types';

interface ComicPanelProps {
  panels: ComicPanelData[];
  characterColor: string;
  onComplete: () => void;
}

export default function ComicPanel({ panels, characterColor, onComplete }: ComicPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const panel = panels[currentIndex];
  const isLast = currentIndex === panels.length - 1;

  // Typing effect for dialogue
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const text = panel.dialogue;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [currentIndex, panel.dialogue]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(panel.dialogue);
      setIsTyping(false);
      return;
    }
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Panel */}
          <div
            className="rounded-2xl overflow-hidden comic-border"
            style={{ borderColor: `${characterColor}40` }}
          >
            {/* Image area (placeholder with gradient) */}
            <div
              className="h-48 md:h-64 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${characterColor}20, #0a0a0a 70%)`,
              }}
            >
              {panel.image ? (
                <img
                  src={panel.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-2">🎬</div>
                  <p className="text-xs text-white/30">Comic Panel</p>
                </div>
              )}
            </div>

            {/* Dialogue */}
            <div className="p-6">
              <div className="speech-bubble" style={{ borderColor: `${characterColor}30` }}>
                <p className="text-white/80 leading-relaxed">
                  {displayedText}
                  {isTyping && (
                    <span className="animate-pulse" style={{ color: characterColor }}>|</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Panel counter */}
          <div className="flex justify-between items-center mt-4 px-2">
            <span className="text-xs text-white/30">
              Panel {currentIndex + 1} of {panels.length}
            </span>
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{
                background: `${characterColor}20`,
                color: characterColor,
                border: `1px solid ${characterColor}30`,
              }}
            >
              {isTyping ? 'Skip' : isLast ? 'Continue' : 'Next Panel'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
