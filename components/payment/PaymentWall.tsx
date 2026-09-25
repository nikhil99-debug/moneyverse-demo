'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PaymentWallProps {
  characterColor: string;
  characterName: string;
  onClose: () => void;
}

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 199,
    priceLabel: '₹199/mo',
    description: 'Full access, cancel anytime',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 999,
    priceLabel: '₹999/yr',
    description: '₹83/mo — Save 58%',
    badge: 'Best Value',
  },
];

export default function PaymentWall({ characterColor, characterName, onClose }: PaymentWallProps) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();

      if (data.orderId && typeof window !== 'undefined' && (window as Record<string, unknown>).Razorpay) {
        const RazorpayClass = (window as Record<string, unknown>).Razorpay as new (options: Record<string, unknown>) => { open: () => void };
        const rzp = new RazorpayClass({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: 'INR',
          name: 'MoneyMania Pro',
          description: `MoneyMania Pro — ${selectedPlan} plan`,
          order_id: data.orderId,
          handler: () => {
            window.location.reload();
          },
          theme: { color: '#f5a623' },
        });
        rzp.open();
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative"
        style={{ borderColor: `${characterColor}30` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-2xl font-black">Unlock the Full Universe</h2>
          <p className="text-sm text-white/40 mt-2">
            Chapter 2+ of {characterName} and all other characters
          </p>
        </div>

        {/* Plan selection */}
        <div className="space-y-3 mb-6">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className="w-full p-4 rounded-xl text-left transition-all border"
              style={{
                background:
                  selectedPlan === plan.id
                    ? `${characterColor}10`
                    : 'rgba(255,255,255,0.03)',
                borderColor:
                  selectedPlan === plan.id ? characterColor : 'rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{plan.name}</span>
                    {plan.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1">{plan.description}</p>
                </div>
                <span className="text-xl font-black" style={{ color: characterColor }}>
                  {plan.priceLabel}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mb-6 space-y-2">
          {[
            'All 25 chapters across 5 characters',
            'All interactive exercises & calculators',
            'Full leaderboard & badge system',
            'Completion certificate for LinkedIn',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-white/60">
              <span className="text-emerald">✓</span>
              {feature}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ background: characterColor, color: '#0a0a0a' }}
        >
          {loading ? 'Processing...' : 'Upgrade to Pro'}
        </button>

        <p className="text-center text-xs text-white/20 mt-3">
          Secure payment via Razorpay. Cancel anytime.
        </p>
      </motion.div>
    </motion.div>
  );
}
