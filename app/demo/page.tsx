'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { track } from '@vercel/analytics';

/* ============================================================
   MoneyVerse public demo shell.
   - Embeds the polished standalone modules from /public/demo-modules
     (Nexus hub + Captain Interest + Inflare) inside one iframe.
   - No login, no Supabase, no Razorpay. All state is localStorage
     under the `moneyverse_demo_` prefix (seeded by shared-state.js).
   ============================================================ */

// OutChase contact — WhatsApp. wa.me needs digits only (country code + number).
const CONTACT_WHATSAPP = '919765755149'; // +91 97657 55149
// TODO(outchase): drop a real logo at /public/demo-modules/logo.svg to use an image mark.

const NEXUS_SRC = '/demo-modules/nexus.html';
const INTRO_KEY = 'moneyverse_demo_intro_seen';
const REF_KEY = 'moneyverse_demo_ref';

type DemoMsg = { source?: string; event?: string; character?: string; chapter?: number };

const INTRO_SLIDES: { title: string; body: string }[] = [
  {
    title: 'Welcome to MoneyVerse',
    body: 'A gamified financial-literacy world for Indian college students. Learn money — UPI, credit, inflation, investing — through short, cinematic, interactive chapters instead of boring lectures.',
  },
  {
    title: 'The Nexus is your map',
    body: 'Each character is a territory that lights up as you learn. Finish chapters to earn tokens, keep a streak, and climb the leaderboard. More characters are on the way.',
  },
  {
    title: 'Start with Captain Interest',
    body: 'Tap the Captain Interest territory to play a real chapter end-to-end — then try Inflare, the villain who makes your money worthless. Everything here is live; nothing is faked.',
  },
];

export default function DemoPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const openedRef = useRef(false);
  const refCodeRef = useRef<string | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    // ---- capture ?ref= (persist for the session) ----
    let ref: string | null = null;
    try {
      const param = new URLSearchParams(window.location.search).get('ref');
      if (param) localStorage.setItem(REF_KEY, param.slice(0, 64));
      ref = param || localStorage.getItem(REF_KEY);
    } catch {
      /* localStorage may be unavailable */
    }
    refCodeRef.current = ref;

    // ---- fire "demo opened" once ----
    if (!openedRef.current) {
      openedRef.current = true;
      try {
        track('demo_opened', ref ? { ref } : {});
      } catch {
        /* analytics optional */
      }
    }

    // ---- first-visit intro (deferred one tick past mount: avoids a
    //      synchronous effect setState and any hydration mismatch) ----
    let seen = true;
    try {
      seen = localStorage.getItem(INTRO_KEY) === '1';
    } catch {
      seen = false;
    }
    const introTimer = seen ? undefined : window.setTimeout(() => setShowIntro(true), 0);

    // ---- relay analytics events posted by the embedded modules ----
    const onMessage = (e: MessageEvent) => {
      const d = e.data as DemoMsg;
      if (!d || d.source !== 'mv-demo' || !d.event) return;
      const props: Record<string, string | number> = {};
      if (ref) props.ref = ref;
      if (d.character) props.character = d.character;
      if (typeof d.chapter === 'number') props.chapter = d.chapter;
      try {
        track(d.event, props);
      } catch {
        /* analytics optional */
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      if (introTimer) clearTimeout(introTimer);
    };
  }, []);

  const closeIntro = useCallback(() => {
    try {
      localStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowIntro(false);
  }, []);

  const nextSlide = useCallback(() => {
    setSlide((s) => {
      if (s >= INTRO_SLIDES.length - 1) {
        closeIntro();
        return s;
      }
      return s + 1;
    });
  }, [closeIntro]);

  const isLast = slide >= INTRO_SLIDES.length - 1;

  return (
    <div style={styles.root}>
      {/* ---- slim top bar ---- */}
      <header style={styles.topbar}>
        <div style={styles.brand}>
          {/* Replace this mark with <img src="/demo-modules/logo.svg" .../> when available */}
          <span style={styles.logoMark} aria-hidden>
            O
          </span>
          <span style={styles.logoText}>OutChase</span>
          <span style={styles.demoChip}>Demo</span>
        </div>
        <a
          href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(
            'Hi OutChase — I just tried the MoneyVerse demo and would like to know more.',
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.contactBtn}
          onClick={() => {
            try {
              track('contact_clicked', refCodeRef.current ? { ref: refCodeRef.current } : {});
            } catch {
              /* ignore */
            }
          }}
        >
          Contact us
        </a>
      </header>

      {/* ---- embedded MoneyVerse modules ---- */}
      <iframe
        ref={iframeRef}
        src={NEXUS_SRC}
        title="MoneyVerse interactive demo"
        style={styles.frame}
        allow="fullscreen"
      />

      {/* ---- first-visit intro ---- */}
      {showIntro && (
        <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Demo introduction">
          <div style={styles.card}>
            <div style={styles.dots}>
              {INTRO_SLIDES.map((_, i) => (
                <span key={i} style={{ ...styles.dot, ...(i === slide ? styles.dotOn : null) }} />
              ))}
            </div>
            <h2 style={styles.cardTitle}>{INTRO_SLIDES[slide].title}</h2>
            <p style={styles.cardBody}>{INTRO_SLIDES[slide].body}</p>
            <div style={styles.cardActions}>
              <button style={styles.skipBtn} onClick={closeIntro}>
                Skip
              </button>
              <button style={styles.nextBtn} onClick={nextSlide}>
                {isLast ? 'Enter the demo' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Analytics />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    background: '#0e0f14',
    color: '#f2f3f7',
    fontFamily:
      "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  },
  topbar: {
    flex: '0 0 auto',
    height: 54,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 14px',
    background: 'rgba(14,15,20,.92)',
    borderBottom: '1px solid #2a2f3c',
    backdropFilter: 'saturate(1.2) blur(12px)',
    WebkitBackdropFilter: 'saturate(1.2) blur(12px)',
    zIndex: 5,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    fontSize: 15,
    color: '#0c1512',
    background: 'linear-gradient(135deg,#26d3ab,#8b7dfb)',
    flex: 'none',
  },
  logoText: { fontWeight: 700, fontSize: 15, letterSpacing: '-.01em', whiteSpace: 'nowrap' },
  demoChip: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.04em',
    textTransform: 'uppercase',
    color: '#f5b021',
    border: '1px solid rgba(245,176,33,.4)',
    background: 'rgba(245,176,33,.12)',
    borderRadius: 100,
    padding: '3px 9px',
    marginLeft: 2,
  },
  contactBtn: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0c1512',
    background: '#26d3ab',
    borderRadius: 100,
    padding: '8px 15px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flex: 'none',
  },
  frame: { flex: '1 1 auto', width: '100%', border: 0, display: 'block', background: '#0e0f14' },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'grid',
    placeItems: 'center',
    padding: 20,
    background: 'rgba(0,0,0,.72)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#171922',
    border: '1px solid #2a2f3c',
    borderRadius: 18,
    boxShadow: '0 24px 64px rgba(0,0,0,.55)',
    padding: 24,
  },
  dots: { display: 'flex', gap: 6, marginBottom: 16 },
  dot: { width: 20, height: 4, borderRadius: 100, background: '#2a2f3c' },
  dotOn: { background: '#26d3ab' },
  cardTitle: { margin: '0 0 8px', fontSize: 21, fontWeight: 700, letterSpacing: '-.01em' },
  cardBody: { margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#a7abb9' },
  cardActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 },
  skipBtn: {
    background: 'none',
    border: 0,
    color: '#6a6f80',
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '8px 4px',
  },
  nextBtn: {
    background: '#26d3ab',
    color: '#0c1512',
    border: 0,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    padding: '11px 20px',
  },
};
