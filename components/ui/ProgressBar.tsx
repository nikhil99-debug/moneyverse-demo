'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  color: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, color, height = 8, showLabel = false }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div
        className="w-full rounded-full overflow-hidden bg-white/10"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full xp-bar-animate"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-white/40 mt-1 text-right">{progress}%</p>
      )}
    </div>
  );
}
