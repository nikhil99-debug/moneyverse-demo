'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/stores/useAppStore';
import { getXPProgress } from '@/lib/xp';
import { characters } from '@/lib/characters';
import ProgressBar from '@/components/ui/ProgressBar';

export default function DashboardPage() {
  const { user } = useUser();
  const { xp, level, streakCount, isPro, progress } = useAppStore();
  const xpProgress = getXPProgress(xp);

  const firstName = user?.firstName || 'Learner';

  // Find current chapter for "Continue Learning"
  const lastProgress = progress.length > 0 ? progress[progress.length - 1] : null;
  const currentCharacter = lastProgress
    ? characters.find((c) => c.slug === lastProgress.characterSlug)
    : characters[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] halftone">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-xl font-black tracking-tight">
          <span className="text-gold">MONEY</span>MANIA
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/learn"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Universe
          </Link>
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt=""
              className="w-8 h-8 rounded-full border border-white/10"
            />
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        {/* Hero Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-6 md:p-8 mt-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                Hey {firstName}!{' '}
                {streakCount > 0 && (
                  <span className="text-red">
                    Day {streakCount} streak 🔥
                  </span>
                )}
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Level {xpProgress.current.level} — {xpProgress.current.title}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-black text-gold">{xp}</p>
                <p className="text-xs text-white/30">Total XP</p>
              </div>
              {!isPro && (
                <Link
                  href="#pricing"
                  className="px-4 py-2 bg-gold text-black font-bold rounded-full text-xs hover:bg-gold-light transition-colors"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/30 mb-1">
              <span>Level {xpProgress.current.level}</span>
              <span>
                {xpProgress.next
                  ? `${xpProgress.xpToNext} XP to Level ${xpProgress.next.level}`
                  : 'MAX LEVEL'}
              </span>
            </div>
            <ProgressBar progress={xpProgress.progress} color="#f5a623" />
          </div>
        </motion.div>

        {/* Continue Learning */}
        {currentCharacter && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">
              Continue Learning
            </h2>
            <Link
              href={`/learn/${currentCharacter.slug}/${lastProgress?.chapterNumber || 1}`}
            >
              <div
                className="glass-card p-5 flex items-center gap-4 group hover:border-opacity-30 transition-all cursor-pointer"
                style={{ borderColor: `${currentCharacter.color}20` }}
              >
                <div className="text-4xl">{currentCharacter.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-white transition-colors">
                    {currentCharacter.name}
                  </h3>
                  <p className="text-sm text-white/40">
                    Chapter {lastProgress?.chapterNumber || 1} —{' '}
                    {currentCharacter.chapters[(lastProgress?.chapterNumber || 1) - 1]?.title}
                  </p>
                </div>
                <span
                  className="text-sm font-bold px-4 py-2 rounded-full transition-all"
                  style={{
                    background: `${currentCharacter.color}20`,
                    color: currentCharacter.color,
                  }}
                >
                  Resume →
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Character Progress Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">
            Your Universe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char) => {
              const charProgress = progress.filter(
                (p) => p.characterSlug === char.slug && p.quizScore !== null
              );
              const completedChapters = charProgress.length;
              const totalChapters = char.chapters.length;
              const progressPct = Math.round(
                (completedChapters / totalChapters) * 100
              );

              return (
                <Link key={char.slug} href={`/learn/${char.slug}`}>
                  <div
                    className="glass-card p-4 hover:border-opacity-30 transition-all cursor-pointer group"
                    style={{ borderColor: `${char.color}15` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{char.emoji}</span>
                      <div>
                        <h3
                          className="font-bold text-sm"
                          style={{ color: char.color }}
                        >
                          {char.name}
                        </h3>
                        <p className="text-xs text-white/30">
                          {completedChapters}/{totalChapters} chapters
                        </p>
                      </div>
                    </div>
                    <ProgressBar
                      progress={progressPct}
                      color={char.color}
                      height={4}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total XP', value: xp.toLocaleString(), icon: '⚡' },
            { label: 'Level', value: `${level}`, icon: '🏆' },
            { label: 'Streak', value: `${streakCount} days`, icon: '🔥' },
            {
              label: 'Plan',
              value: isPro ? 'PRO' : 'Free',
              icon: isPro ? '💎' : '🆓',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-black">{stat.value}</div>
              <div className="text-xs text-white/30">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Membership */}
        {!isPro && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            id="pricing"
            className="mt-8"
          >
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">
              Unlock Everything
            </h2>
            <div className="glass-card p-6 border-gold/20 text-center">
              <h3 className="text-xl font-black text-gold mb-2">MoneyMania Pro</h3>
              <p className="text-white/40 text-sm mb-4">
                All 25 chapters. All interactive exercises. Full leaderboard access.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div>
                  <p className="text-2xl font-black">₹199<span className="text-sm font-normal text-white/40">/mo</span></p>
                </div>
                <div className="text-white/20">or</div>
                <div>
                  <p className="text-2xl font-black text-gold">₹999<span className="text-sm font-normal text-white/40">/yr</span></p>
                  <p className="text-xs text-emerald">Save 58%</p>
                </div>
              </div>
              <p className="text-xs text-white/30 mb-4">
                Less than a biryani per month. More valuable than an MBA elective.
              </p>
              <button className="px-8 py-3 bg-gold text-black font-bold rounded-full hover:bg-gold-light transition-all hover:scale-105">
                Upgrade to Pro
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
