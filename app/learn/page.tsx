'use client';

import { motion } from 'framer-motion';
import { characters } from '@/lib/characters';
import CharacterCard from '@/components/characters/CharacterCard';
import Link from 'next/link';

export default function CharacterSelectPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] halftone">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-xl font-black tracking-tight">
          <span className="text-gold">MONEY</span>MANIA
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Dashboard
        </Link>
      </nav>

      {/* Title */}
      <div className="text-center pt-8 pb-4 px-6">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-black tracking-tight"
        >
          THE <span className="text-gold">UNIVERSE</span>
        </motion.h1>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-white/40 text-sm md:text-base max-w-lg mx-auto"
        >
          Choose your character. Each one teaches a different chapter of the money story.
          Start anywhere — but we suggest the order below.
        </motion.p>
      </div>

      {/* Character Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {characters.map((character, index) => (
            <CharacterCard
              key={character.slug}
              character={character}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Suggested order hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center pb-12"
      >
        <p className="text-xs text-white/20">
          Suggested order: Moneta → Inflare → Mr. Weal → Recsus → Captain Interest
        </p>
      </motion.div>
    </div>
  );
}
