'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Character } from '@/lib/characters';

interface CharacterCardProps {
  character: Character;
  index: number;
}

export default function CharacterCard({ character, index }: CharacterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="group relative"
    >
      <Link href={`/learn/${character.slug}`}>
        <div
          className="relative w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden comic-border cursor-pointer transition-all duration-300"
          style={{
            borderColor: `${character.color}50`,
            background: `linear-gradient(160deg, ${character.color}15, #0a0a0a 60%)`,
          }}
        >
          {/* Glow effect on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at center, ${character.color}15 0%, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative p-6 flex flex-col items-center text-center">
            {/* Character emoji/avatar */}
            <motion.div
              className="text-6xl mb-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            >
              {character.emoji}
            </motion.div>

            {/* Role badge */}
            <span
              className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-3"
              style={{
                color: character.color,
                background: `${character.color}15`,
                border: `1px solid ${character.color}30`,
              }}
            >
              {character.role}
            </span>

            {/* Name */}
            <h3
              className="text-2xl font-black tracking-tight"
              style={{ color: character.color }}
            >
              {character.name}
            </h3>

            {/* Tagline */}
            <p className="mt-2 text-sm text-white/50 italic leading-relaxed line-clamp-2">
              &ldquo;{character.tagline}&rdquo;
            </p>

            {/* Arc theme */}
            <p className="mt-3 text-xs text-white/30">
              {character.arcTheme}
            </p>

            {/* Chapter count */}
            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <span>{character.chapters.length} chapters</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-emerald">Ch.1 FREE</span>
            </div>

            {/* CTA */}
            <div
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group-hover:shadow-lg"
              style={{
                background: `${character.color}20`,
                color: character.color,
                border: `1px solid ${character.color}30`,
              }}
            >
              Begin Arc
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
