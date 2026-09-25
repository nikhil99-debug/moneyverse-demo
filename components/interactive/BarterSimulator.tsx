'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarterSimulatorProps {
  items?: string[];
  characterColor: string;
  onComplete: () => void;
}

const DEFAULT_ITEMS = ['🌾 Wheat', '👟 Shoes', '🏺 Pottery', '🧵 Cloth'];

const SCENARIOS = [
  {
    you: '🌾 Wheat',
    them: '👟 Shoes',
    theyWant: '🏺 Pottery',
    message: "The shoemaker doesn't want wheat! He wants pottery.",
  },
  {
    you: '🌾 Wheat',
    them: '🏺 Pottery',
    theyWant: '🧵 Cloth',
    message: "The potter doesn't want wheat either! She wants cloth.",
  },
  {
    you: '🌾 Wheat',
    them: '🧵 Cloth',
    theyWant: '👟 Shoes',
    message: "The weaver wants shoes, not wheat! See the problem?",
  },
];

export default function BarterSimulator({ characterColor, onComplete }: BarterSimulatorProps) {
  const [step, setStep] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showFail, setShowFail] = useState(false);
  const [showLesson, setShowLesson] = useState(false);

  const scenario = SCENARIOS[step];

  const handleDrop = () => {
    setDraggedItem(null);
    setShowFail(true);
    setTimeout(() => {
      setShowFail(false);
      if (step < SCENARIOS.length - 1) {
        setStep((s) => s + 1);
      } else {
        setShowLesson(true);
      }
    }, 2000);
  };

  if (showLesson) {
    return (
      <div className="w-full max-w-lg mx-auto py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl p-8 text-center comic-border"
          style={{
            borderColor: `${characterColor}40`,
            background: `linear-gradient(160deg, ${characterColor}10, #141414)`,
          }}
        >
          <div className="text-4xl mb-4">💡</div>
          <h3 className="text-xl font-bold mb-3" style={{ color: characterColor }}>
            The Double Coincidence of Wants
          </h3>
          <p className="text-white/60 leading-relaxed">
            For barter to work, both people need to want exactly what the other has,
            at the exact same time. This is nearly impossible in practice!
          </p>
          <p className="text-white/60 leading-relaxed mt-3">
            This fundamental problem is why humans invented <strong className="text-white">money</strong> —
            a universal medium of exchange that everyone agrees has value.
          </p>
          <button
            onClick={onComplete}
            className="mt-6 px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{ background: characterColor, color: '#0a0a0a' }}
          >
            Continue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="text-center mb-6">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: characterColor }}>
          Interactive Exercise
        </p>
        <h3 className="text-lg font-bold">Try to Trade Your Wheat</h3>
        <p className="text-sm text-white/40 mt-1">
          Attempt {step + 1} of {SCENARIOS.length} — drag your item to trade
        </p>
      </div>

      <div className="flex items-center justify-between gap-8 px-4">
        {/* Your item */}
        <motion.div
          className="flex flex-col items-center gap-2"
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragStart={() => setDraggedItem(scenario.you)}
          onDragEnd={handleDrop}
          whileDrag={{ scale: 1.1 }}
        >
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing comic-border"
            style={{
              borderColor: `${characterColor}40`,
              background: `${characterColor}10`,
            }}
          >
            {scenario.you.split(' ')[0]}
          </div>
          <span className="text-xs text-white/50">You have</span>
          <span className="text-sm font-bold">{scenario.you}</span>
        </motion.div>

        {/* Arrow */}
        <div className="text-2xl text-white/20">→</div>

        {/* Their item */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl comic-border border-white/10 bg-white/5">
            {scenario.them.split(' ')[0]}
          </div>
          <span className="text-xs text-white/50">They have</span>
          <span className="text-sm font-bold">{scenario.them}</span>
          <span className="text-[10px] text-red">
            Wants: {scenario.theyWant}
          </span>
        </div>
      </div>

      {/* Fail message */}
      <AnimatePresence>
        {showFail && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 rounded-xl bg-red/10 border border-red/20 text-center"
          >
            <p className="text-sm text-red font-bold">Trade Failed! ✗</p>
            <p className="text-xs text-white/50 mt-1">{scenario.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
