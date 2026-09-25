'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getCharacter } from '@/lib/characters';
import { notFound } from 'next/navigation';

export default function CharacterChaptersPage({
  params,
}: {
  params: Promise<{ character: string }>;
}) {
  const { character: slug } = use(params);
  const character = getCharacter(slug);

  if (!character) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] halftone">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/learn" className="text-sm text-white/60 hover:text-white transition-colors">
          ← Back to Universe
        </Link>
      </nav>

      {/* Character Hero */}
      <div className="text-center pt-4 pb-8 px-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl mb-4"
        >
          {character.emoji}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span
            className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full"
            style={{
              color: character.color,
              background: `${character.color}15`,
              border: `1px solid ${character.color}30`,
            }}
          >
            {character.role}
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-5xl md:text-6xl font-black tracking-tight"
          style={{ color: character.color }}
        >
          {character.name}
        </motion.h1>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 speech-bubble max-w-md mx-auto"
        >
          <p className="text-white/70 italic">&ldquo;{character.tagline}&rdquo;</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-sm text-white/40"
        >
          {character.arcTheme}
        </motion.p>
      </div>

      {/* Chapter List */}
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <div className="space-y-4">
          {character.chapters.map((chapter, i) => (
            <motion.div
              key={chapter.number}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <Link
                href={
                  chapter.isFree
                    ? `/learn/${slug}/${chapter.number}`
                    : '#'
                }
                className={`block ${!chapter.isFree ? 'opacity-60' : ''}`}
              >
                <div
                  className="glass-card p-5 flex items-center gap-4 group hover:border-opacity-30 transition-all"
                  style={{
                    borderColor: chapter.isFree ? `${character.color}30` : undefined,
                  }}
                >
                  {/* Chapter number */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0"
                    style={{
                      background: `${character.color}15`,
                      color: character.color,
                    }}
                  >
                    {chapter.number}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-white/90">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      ~{chapter.estimatedMinutes} min
                    </p>
                  </div>

                  {/* Status */}
                  <div className="shrink-0">
                    {chapter.isFree ? (
                      <span className="text-xs font-bold text-emerald px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20">
                        FREE
                      </span>
                    ) : (
                      <span className="text-xs text-white/30">
                        🔒 PRO
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
