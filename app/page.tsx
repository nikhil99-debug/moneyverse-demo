'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden halftone">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <CinematicIntro key="intro" />
        ) : (
          <MainLanding key="main" />
        )}
      </AnimatePresence>
    </div>
  );
}

function CinematicIntro() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
            <span className="text-gold">MONEY</span>
            <span className="text-white">MANIA</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-4"
        >
          <p className="text-xl md:text-2xl text-white/60 font-light tracking-wide">
            MONEY TALKS. <span className="text-gold font-semibold">FINALLY.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-8 h-[2px] w-48 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="mt-6 text-sm text-white/30 tracking-widest uppercase"
        >
          An OutChase Digital Experience
        </motion.p>
      </div>
    </motion.div>
  );
}

function MainLanding() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col"
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-gold">MONEY</span>MANIA
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/learn"
            className="px-5 py-2 bg-gold text-black font-semibold rounded-full text-sm hover:bg-gold-light transition-colors"
          >
            Start Learning
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            Learn Money.
            <br />
            <span className="text-gold">Like Never Before.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl"
        >
          Pick a character. Master financial concepts through cinematic, interactive chapters.
          Earn XP. Compete on leaderboards. Go from clueless to dangerous.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/learn"
            className="px-8 py-4 bg-gold text-black font-bold rounded-full text-lg hover:bg-gold-light transition-all hover:scale-105 glitch-hover"
          >
            Enter the Universe
          </Link>
          <Link
            href="#characters"
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full text-lg hover:bg-white/5 transition-all"
          >
            Meet the Characters
          </Link>
        </motion.div>

        {/* Character Preview */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          id="characters"
          className="mt-20 flex gap-4 md:gap-6"
        >
          {[
            { emoji: '🪙', name: 'MONETA', color: '#f5a623' },
            { emoji: '🔥', name: 'INFLARE', color: '#e74c3c' },
            { emoji: '💚', name: 'MR. WEAL', color: '#2ecc71' },
            { emoji: '💜', name: 'RECSUS', color: '#8e44ad' },
            { emoji: '💙', name: 'CAPT. INTEREST', color: '#00d4ff' },
          ].map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.4 + i * 0.1, type: 'spring' }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl comic-border cursor-pointer hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${char.color}20, ${char.color}05)`,
                borderColor: `${char.color}40`,
              }}
              title={char.name}
            >
              {char.emoji}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-4 text-xs text-white/30"
        >
          5 characters. 25 chapters. 1 universe.
        </motion.p>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/20 text-xs">
        Built by OutChase. For India. For Gen-Z.
      </footer>
    </motion.div>
  );
}
