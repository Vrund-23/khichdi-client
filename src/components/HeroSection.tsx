import { Search } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import React from 'react';

const FloatingSpice = ({ emoji, style, duration, delay, isVisible }: { emoji: string; style: React.CSSProperties; duration: number; delay: number; isVisible: boolean }) => (
  <span
    className="absolute select-none pointer-events-none"
    style={{
      fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
      ...style,
      animation: `floatSpice ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      animationPlayState: isVisible ? "running" : "paused",
    }}
  >
    {emoji}
  </span>
);

const ChefCharacter = ({ isVisible }: { isVisible: boolean }) => (
  <svg
    viewBox="0 0 180 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      bottom: "0",
      left: "-52px",
      width: "clamp(100px, 14vw, 180px)",
      zIndex: 4,
      animation: "chefBob 3.2s ease-in-out infinite",
      animationPlayState: isVisible ? "running" : "paused",
      filter: "drop-shadow(0 12px 32px rgba(22,163,74,0.3))",
    }}
  >
    <defs>
      {/* Skin tone gradient */}
      <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffe4b5" />
        <stop offset="100%" stopColor="#f4c07a" />
      </radialGradient>
      {/* Hat gradient */}
      <linearGradient id="hatGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e8fdf0" />
      </linearGradient>
      {/* Body gradient */}
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
      {/* Apron gradient */}
      <linearGradient id="apronGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f0fdf4" />
      </linearGradient>
    </defs>

    {/* ── CHEF HAT ── */}
    {/* Hat brim */}
    <ellipse cx="90" cy="68" rx="44" ry="11" fill="#dcfce7" stroke="#4ade80" strokeWidth="2.5" />
    {/* Hat body tall cylinder */}
    <rect x="55" y="22" width="70" height="50" rx="10" fill="url(#hatGrad)" stroke="#4ade80" strokeWidth="2.5" />
    {/* Hat top puff bubble */}
    <ellipse cx="90" cy="20" rx="30" ry="16" fill="white" stroke="#4ade80" strokeWidth="2.5" />
    {/* Hat top extra puff */}
    <ellipse cx="90" cy="10" rx="22" ry="14" fill="white" stroke="#4ade80" strokeWidth="2" />
    {/* Hat stripe accent */}
    <rect x="55" y="52" width="70" height="8" rx="2" fill="#dcfce7" opacity="0.7" />

    {/* ── NECK ── */}
    <rect x="80" y="115" width="20" height="16" rx="6" fill="url(#skinGrad)" />

    {/* ── FACE ── */}
    <circle cx="90" cy="100" r="38" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" />

    {/* Ear left */}
    <ellipse cx="52" cy="100" rx="8" ry="11" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" />
    <ellipse cx="52" cy="100" rx="4" ry="7" fill="#f9a875" opacity="0.4" />
    {/* Ear right */}
    <ellipse cx="128" cy="100" rx="8" ry="11" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" />
    <ellipse cx="128" cy="100" rx="4" ry="7" fill="#f9a875" opacity="0.4" />

    {/* Eyebrows — raised cheerfully */}
    <path d="M71 82 Q79 77 87 81" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M93 81 Q101 77 109 82" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Eyes — big round sparkly */}
    <circle cx="79" cy="94" r="9" fill="white" />
    <circle cx="101" cy="94" r="9" fill="white" />
    <circle cx="79" cy="94" r="6" fill="#1a1a1a" />
    <circle cx="101" cy="94" r="6" fill="#1a1a1a" />
    {/* Iris colour */}
    <circle cx="79" cy="94" r="3.5" fill="#14532d" />
    <circle cx="101" cy="94" r="3.5" fill="#14532d" />
    {/* Sparkle highlights */}
    <circle cx="82" cy="91" r="2" fill="white" />
    <circle cx="104" cy="91" r="2" fill="white" />
    <circle cx="77" cy="96" r="1" fill="white" opacity="0.7" />

    {/* Nose */}
    <ellipse cx="90" cy="106" rx="5" ry="4" fill="#f4a261" opacity="0.6" />
    <circle cx="87" cy="107" r="1.5" fill="#e07a3a" opacity="0.5" />
    <circle cx="93" cy="107" r="1.5" fill="#e07a3a" opacity="0.5" />

    {/* Big happy smile */}
    <path d="M73 116 Q90 132 107 116" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Teeth */}
    <path d="M76 117 Q90 130 104 117" fill="white" opacity="0.85" />

    {/* Rosy cheeks */}
    <ellipse cx="63" cy="110" rx="10" ry="7" fill="#ff8c6b" opacity="0.22" />
    <ellipse cx="117" cy="110" rx="10" ry="7" fill="#ff8c6b" opacity="0.22" />

    {/* ── BODY ── */}
    <rect x="48" y="128" width="84" height="90" rx="20" fill="url(#bodyGrad)" />

    {/* Apron */}
    <rect x="62" y="132" width="56" height="80" rx="14" fill="url(#apronGrad)" opacity="0.95" />
    {/* Apron top tie bow */}
    <path d="M72 132 Q90 126 108 132" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Apron pocket */}
    <rect x="72" y="180" width="36" height="22" rx="8" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.5" />
    {/* Little spoon in pocket */}
    <line x1="84" y1="179" x2="84" y2="168" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="84" cy="165" r="4" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" />
    {/* Fork in pocket */}
    <line x1="96" y1="179" x2="96" y2="168" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="93" y1="172" x2="93" y2="167" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="96" y1="172" x2="96" y2="167" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="99" y1="172" x2="99" y2="167" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />

    {/* ── LEFT ARM — raised holding K ── */}
    {/* Upper arm */}
    <path d="M50 145 C30 138 16 125 10 108" stroke="url(#skinGrad)" strokeWidth="20" strokeLinecap="round" fill="none" />
    <path d="M50 145 C30 138 16 125 10 108" stroke="#f4c07a" strokeWidth="16" strokeLinecap="round" fill="none" />
    {/* Sleeve cuff */}
    <ellipse cx="10" cy="108" rx="11" ry="8" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" transform="rotate(-20 10 108)" />
    {/* Hand */}
    <circle cx="8" cy="98" r="13" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" />
    {/* Thumb */}
    <ellipse cx="-2" cy="92" rx="5" ry="8" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" transform="rotate(-30 -2 92)" />
    {/* Fingers gripping K */}
    <ellipse cx="4" cy="87" rx="4" ry="8" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" transform="rotate(-10 4 87)" />
    <ellipse cx="11" cy="85" rx="4" ry="8" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" />
    <ellipse cx="18" cy="87" rx="4" ry="8" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" transform="rotate(10 18 87)" />
    {/* Knuckle highlights */}
    <circle cx="4" cy="88" r="1.5" fill="white" opacity="0.35" />
    <circle cx="11" cy="86" r="1.5" fill="white" opacity="0.35" />
    <circle cx="18" cy="88" r="1.5" fill="white" opacity="0.35" />

    {/* ── RIGHT ARM — holding a bowl ── */}
    <path d="M130 148 C152 155 164 165 168 178" stroke="url(#skinGrad)" strokeWidth="20" strokeLinecap="round" fill="none" />
    <path d="M130 148 C152 155 164 165 168 178" stroke="#f4c07a" strokeWidth="16" strokeLinecap="round" fill="none" />
    {/* Sleeve cuff right */}
    <ellipse cx="168" cy="178" rx="11" ry="8" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" transform="rotate(20 168 178)" />
    {/* Right hand */}
    <circle cx="170" cy="188" r="13" fill="url(#skinGrad)" stroke="#f4c07a" strokeWidth="1.5" />

    {/* ── BOWL of khichdi ── */}
    {/* Bowl body */}
    <ellipse cx="170" cy="200" rx="22" ry="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
    <ellipse cx="170" cy="196" rx="22" ry="10" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
    {/* Khichdi filling */}
    <ellipse cx="170" cy="196" rx="18" ry="7" fill="#fcd34d" opacity="0.9" />
    {/* Rice / dal dots */}
    <circle cx="164" cy="195" r="2" fill="#f59e0b" />
    <circle cx="170" cy="193" r="2.5" fill="#f59e0b" />
    <circle cx="176" cy="195" r="2" fill="#f59e0b" />
    <circle cx="167" cy="198" r="1.5" fill="#d97706" />
    <circle cx="174" cy="197" r="1.5" fill="#d97706" />
    {/* Steam from bowl */}
    <path d="M163 190 Q160 183 163 176" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"
      style={{ animation: "steamPuff 2s ease-in-out infinite" }} />
    <path d="M170 188 Q167 180 170 172" stroke="#86efac" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"
      style={{ animation: "steamPuff 2s ease-in-out infinite", animationDelay: "0.5s" }} />
    <path d="M177 190 Q180 183 177 176" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"
      style={{ animation: "steamPuff 2s ease-in-out infinite", animationDelay: "0.25s" }} />
  </svg>
);

// Each letter: char, color, drop-shadow glow color, animation delay
const LETTERS = [
  { char: "K", color: "#dc2626", glow: "rgba(220,38,38,0.5)", delay: "0.0s", big: true },
  { char: "h", color: "#1a1a1a", glow: "rgba(0,0,0,0.4)", delay: "0.08s" },
  { char: "i", color: "#ea580c", glow: "rgba(234,88,12,0.5)", delay: "0.16s" },
  { char: "c", color: "#ca8a04", glow: "rgba(202,138,4,0.5)", delay: "0.24s" },
  { char: "h", color: "#16a34a", glow: "rgba(22,163,74,0.5)", delay: "0.32s" },
  { char: "d", color: "#7c3aed", glow: "rgba(124,58,237,0.5)", delay: "0.40s" },
  { char: "i", color: "#0369a1", glow: "rgba(3,105,161,0.5)", delay: "0.48s" },
];

const HeroSection = ({ onSearch }: { onSearch?: (q: string) => void }) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);

    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const spices = useMemo(() => {
    const rawSpices = [
      { emoji: "🌶️", style: { top: "8%", left: "5%", opacity: 0.65 } },
      { emoji: "🧅", style: { top: "14%", right: "7%", opacity: 0.55 } },
      { emoji: "🫚", style: { bottom: "22%", left: "3%", opacity: 0.5 } },
      { emoji: "🌿", style: { top: "42%", right: "4%", opacity: 0.6 } },
      { emoji: "🫘", style: { bottom: "28%", right: "9%", opacity: 0.5 } },
      { emoji: "✨", style: { top: "22%", left: "11%", opacity: 0.75 } },
      { emoji: "🍋", style: { bottom: "16%", left: "14%", opacity: 0.55 } },
      { emoji: "🧄", style: { top: "62%", right: "6%", opacity: 0.45 } },
    ];
    return rawSpices.map(s => ({
      ...s,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3
    }));
  }, []);

  return (
    <>

      <section
        ref={sectionRef}
        className="grain-overlay relative min-h-[75vh] lg:min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pb-8 sm:pb-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 10%, #ffffff 0%, #f0fdf4 35%, #dcfce7 60%, #bbf7d022 80%, #f0fdf4 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Blob backgrounds */}
        <div style={{ position: "absolute", top: "-10%", left: "-15%", width: "55vw", height: "55vw", borderRadius: "60% 40% 55% 45%", background: "radial-gradient(circle, rgba(74,200,74,0.18) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "0", right: "-10%", width: "45vw", height: "45vw", borderRadius: "40% 60% 45% 55%", background: "radial-gradient(circle, rgba(134,239,172,0.25) 0%, transparent 70%)", filter: "blur(50px)", zIndex: 0 }} />

        {/* Floating spices */}
        {mounted && spices.map((s, i) => <FloatingSpice key={i} emoji={s.emoji} style={s.style} duration={s.duration} delay={s.delay} isVisible={isVisible} />)}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full">



          {/* ── LOGO: K + hichdi each letter its own color ── */}
          <div
            className="hero-logo mt-20 sm:mt-24 mb-2 flex items-end justify-center"
            style={{ position: "relative", lineHeight: 1, gap: "0.01em" }}
          >
            {LETTERS.map((l, i) => {
              const isK = l.big;
              return (
                <div
                  key={i}
                  style={{ position: "relative", display: "inline-block" }}
                >
                  {/* Chef only behind K */}
                  {isK && (
                    <div className="chef-wrap" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 2, pointerEvents: "none" }}>
                      <ChefCharacter isVisible={isVisible} />
                    </div>
                  )}

                  <span
                    className="letter-span"
                    style={{
                      fontSize: isK
                        ? "clamp(7rem, 22vw, 15rem)"
                        : "clamp(4rem, 14vw, 9rem)",
                      color: l.color,
                      filter: `drop-shadow(0 4px 16px ${l.glow})`,
                      letterSpacing: "-0.04em",
                      position: "relative",
                      zIndex: isK ? 3 : 1,
                      // entrance stagger
                      animationDelay: l.delay + ", " + l.delay,
                      marginBottom: isK ? "0" : "0.05em",
                    }}
                  >
                    {l.char}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: "160px", height: "3px", background: "linear-gradient(90deg, #dc2626, #ea580c, #ca8a04, #16a34a, #7c3aed, #0369a1)", borderRadius: "99px", margin: "14px auto 22px" }} />

          {/* Tagline */}
          <h2
            className="hero-tagline mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)", fontWeight: 600, color: "#292524", lineHeight: 1.25, letterSpacing: "-0.01em" }}
          >
            Daily menus.{" "}
            <span style={{ color: "#16a34a", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
              Zero hassle.
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="hero-sub mb-10"
            style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)", color: "#78716c", fontWeight: 400, maxWidth: "480px", lineHeight: 1.65 }}
          >
            ક્યાં જમવું છે એનું Confusion? 🤔<br />'ખિચડી' પાસે છે Solution! ✨
          </p>

          {/* Search bar */}
          <div className="search-wrap w-full max-w-xl" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-4px", borderRadius: "9999px", background: focused ? "linear-gradient(135deg, #4ade8055, #86efac33)" : "transparent", transition: "background 0.4s ease", filter: "blur(12px)", zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.92)", borderRadius: "9999px", border: focused ? "2px solid #4ade80" : "2px solid rgba(74,160,74,0.15)", boxShadow: focused ? "0 8px 40px rgba(74,222,128,0.25), 0 2px 12px rgba(0,0,0,0.08)" : "0 4px 24px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", backdropFilter: "blur(16px)", padding: "6px 6px 6px 24px" }}>
              <Search size={20} style={{ color: focused ? "#16a34a" : "#a8a29e", flexShrink: 0, transition: "color 0.3s" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search mess in Vidyanagar..."
                className="search-input-custom"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "#1c1917", fontWeight: 500, padding: "10px 12px", minWidth: 0 }}
              />
              <button
                className={focused ? "search-btn-pulse" : ""}
                style={{ flexShrink: 0, background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "none", borderRadius: "9999px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 12px rgba(22,163,74,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onClick={() => onSearch?.(query)}
              >
                <Search size={18} color="white" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="badge-row mt-6 sm:mt-8 flex flex-wrap gap-3 justify-center mb-6 sm:mb-10">
            {[
              { icon: "🕐", label: "Updated daily" },
              { icon: "📍", label: "Vidyanagar" },
              { icon: "📍", label: "All-Clubs" },
            ].map((b, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(74,160,74,0.2)", borderRadius: "9999px", padding: "6px 14px", fontSize: "0.82rem", fontWeight: 600, color: "#166534", backdropFilter: "blur(8px)", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", fontFamily: "'DM Sans', sans-serif" }}>
                <span>{b.icon}</span> {b.label}
              </span>
            ))}
          </div>

          {/* Date Badge Below Search */}
          <div
            className="badge-animated mb-2 flex flex-col items-center justify-center px-8 py-3 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, rgba(220,252,231,0.9), rgba(240,253,244,0.95))",
              border: "1.5px solid rgba(74,222,128,0.4)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(22,163,74,0.15), inset 0 2px 0 rgba(255,255,255,0.6)",
              transformOrigin: "center"
            }}
          >
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 800,
              color: "#16a34a",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "-2px"
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 6vw, 42px)",
              fontWeight: 900,
              color: "#14532d",
              lineHeight: 1.1,
              letterSpacing: "-0.02em"
            }}>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, rgba(240,253,244,0.8), transparent)", pointerEvents: "none", zIndex: 2 }} />
      </section>
    </>
  );
};

export default HeroSection;