import React, { useEffect, useState } from 'react';

export const HeroAnimation: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const animClass = (cls: string) => (prefersReducedMotion ? '' : cls);

  return (
    <div
      className="relative w-full flex items-center justify-center bg-transparent select-none"
      role="img"
      aria-label="Animated illustration of software developers collaborating around laptops on an academic software project"
    >
      <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[580px] aspect-[680/520] flex items-center justify-center">
        <svg
          viewBox="0 0 680 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block overflow-visible"
        >
          <defs>
            {/* Subtle warm & cool ambient surface accents */}
            <linearGradient id="eraScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="eraLaptopLid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="eraAmberAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="eraBlueAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            <linearGradient id="eraNavySweater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <filter id="eraCardShadow" x="-12%" y="-12%" width="124%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.07" />
            </filter>

            <filter id="eraSoftShadow" x="-8%" y="-8%" width="116%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.05" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* SUBTLE BACKGROUND ARCHITECTURAL GRID & CONNECTION PATHS        */}
          {/* ============================================================== */}
          <g opacity="0.85">
            {/* Soft geometric floor shadow under desk */}
            <ellipse cx="340" cy="466" rx="268" ry="14" fill="#F1F5F9" />
            <ellipse cx="340" cy="466" rx="195" ry="8" fill="#E2E8F0" opacity="0.65" />

            {/* Animated data-flow connection arcs between floating cards and workstation */}
            <path
              d="M 164 138 C 215 138, 250 185, 290 225"
              stroke="#CBD5E1"
              strokeWidth="1.75"
              strokeDasharray="6 6"
              className={animClass('hero-anim-flow')}
            />
            <path
              d="M 505 142 C 455 142, 420 190, 385 225"
              stroke="#FCD34D"
              strokeWidth="1.75"
              strokeDasharray="6 6"
              className={animClass('hero-anim-flow')}
            />
            <path
              d="M 342 96 L 342 185"
              stroke="#93C5FD"
              strokeWidth="1.75"
              strokeDasharray="5 5"
              className={animClass('hero-anim-flow')}
            />
          </g>

          {/* ============================================================== */}
          {/* FLOATING CARD 1 (TOP LEFT): LIVE CODE EDITOR & COMPONENT TREE  */}
          {/* ============================================================== */}
          <g className={animClass('hero-anim-float-slow')} filter="url(#eraCardShadow)">
            <rect
              x="34"
              y="52"
              width="176"
              height="112"
              rx="12"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            {/* Window Top Bar */}
            <path
              d="M 35 64 C 35 57.5 40.5 52.5 46.5 52.5 L 197.5 52.5 C 203.5 52.5 209 57.5 209 64 L 209 76 L 35 76 Z"
              fill="#F8FAFC"
            />
            <line x1="35" y1="76" x2="209" y2="76" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="49" cy="64" r="3.5" fill="#F87171" />
            <circle cx="60" cy="64" r="3.5" fill="#FBBF24" />
            <circle cx="71" cy="64" r="3.5" fill="#34D399" />
            <rect x="88" y="60.5" width="64" height="7" rx="3.5" fill="#CBD5E1" />

            {/* Code Lines inside Editor */}
            {/* Line 1: import / component tag */}
            <rect x="48" y="88" width="24" height="6" rx="3" fill="#3B82F6" />
            <rect
              x="77"
              y="88"
              width="68"
              height="6"
              rx="3"
              fill="#1E293B"
              className={animClass('hero-anim-code-1')}
            />

            {/* Line 2: indented props */}
            <rect x="58" y="102" width="36" height="6" rx="3" fill="#D97706" />
            <rect
              x="99"
              y="102"
              width="78"
              height="6"
              rx="3"
              fill="#64748B"
              className={animClass('hero-anim-code-2')}
            />

            {/* Line 3: nested function */}
            <rect x="58" y="116" width="48" height="6" rx="3" fill="#10B981" />
            <rect
              x="111"
              y="116"
              width="52"
              height="6"
              rx="3"
              fill="#94A3B8"
              className={animClass('hero-anim-code-3')}
            />

            {/* Line 4: closing tag + blinking cursor */}
            <rect x="48" y="130" width="32" height="6" rx="3" fill="#3B82F6" />
            <rect
              x="85"
              y="129"
              width="3"
              height="8"
              rx="1"
              fill="#D97706"
              className={animClass('hero-anim-cursor')}
            />

            {/* Code Bracket Badge */}
            <rect x="166" y="124" width="30" height="20" rx="6" fill="#FEF3C7" />
            <path
              d="M 177 130 L 173 134 L 177 138 M 185 130 L 189 134 L 185 138"
              stroke="#B45309"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ============================================================== */}
          {/* FLOATING CARD 2 (CENTER TOP): ARCHITECTURE & API SYNC NODE     */}
          {/* ============================================================== */}
          <g className={animClass('hero-anim-float-subtle')} filter="url(#eraSoftShadow)">
            <rect
              x="276"
              y="32"
              width="132"
              height="64"
              rx="12"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            {/* Rotating Sync / Build Gear Icon */}
            <circle cx="304" cy="64" r="16" fill="#EFF6FF" />
            <g className={animClass('hero-anim-spin')}>
              <circle
                cx="304"
                cy="64"
                r="8"
                stroke="#2563EB"
                strokeWidth="2.2"
                strokeDasharray="8 4"
              />
              <circle cx="304" cy="64" r="3" fill="#2563EB" />
            </g>
            {/* Architecture Node Lines */}
            <rect x="328" y="51" width="62" height="7" rx="3.5" fill="#0F172A" />
            <rect x="328" y="64" width="46" height="5" rx="2.5" fill="#64748B" />
            <rect x="328" y="74" width="34" height="5" rx="2.5" fill="#10B981" />
          </g>

          {/* ============================================================== */}
          {/* FLOATING CARD 3 (TOP RIGHT): GIT BRANCH & PR MERGE GRAPH       */}
          {/* ============================================================== */}
          <g className={animClass('hero-anim-float-delayed')} filter="url(#eraCardShadow)">
            <rect
              x="466"
              y="56"
              width="180"
              height="106"
              rx="12"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            {/* Header Strip */}
            <rect x="482" y="70" width="68" height="7" rx="3.5" fill="#0F172A" />
            {/* Verified Check Pill */}
            <rect x="592" y="66" width="38" height="16" rx="8" fill="#D1FAE5" />
            <path
              d="M 605 74 L 609.5 78 L 617.5 70"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Git Branch Graph Visualization */}
            <path
              d="M 494 102 L 616 102"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 518 102 C 528 102, 532 128, 546 128 L 578 128 C 592 128, 596 102, 606 102"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Commit Nodes */}
            <circle cx="498" cy="102" r="5.5" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="550" cy="128" r="5.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="576" cy="128" r="5.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="610" cy="102" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

            {/* Footer status bar inside card */}
            <rect x="482" y="144" width="96" height="5" rx="2.5" fill="#94A3B8" />
          </g>

          {/* ============================================================== */}
          {/* DEVELOPER 1 (LEFT): UI/FRONTEND ENGINEER COLLABORATING         */}
          {/* ============================================================== */}
          <g>
            {/* Modern Ergonomic Task Chair (Left) */}
            <rect x="86" y="310" width="64" height="78" rx="16" fill="#334155" />
            <rect x="112" y="388" width="12" height="54" fill="#475569" />
            <path d="M 90 442 L 146 442" stroke="#334155" strokeWidth="6" strokeLinecap="round" />

            {/* Legs / Trousers */}
            <path
              d="M 112 365 L 136 446 L 154 446 L 138 365 Z"
              fill="#1E293B"
            />
            <path
              d="M 142 365 L 166 446 L 184 446 L 166 365 Z"
              fill="#0F172A"
            />
            {/* Sneakers */}
            <rect x="132" y="444" width="28" height="11" rx="5.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="162" y="444" width="28" height="11" rx="5.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Torso (Warm Amber / Ochre Sweater matching Project Era accent) */}
            <path
              d="M 102 276 C 102 258, 120 248, 144 248 C 168 248, 184 260, 188 282 L 194 364 L 100 364 Z"
              fill="url(#eraAmberAccent)"
            />
            {/* White Collar Shirt Detail */}
            <path d="M 132 248 L 144 264 L 156 248 Z" fill="#FFFFFF" />

            {/* Neck & Head */}
            <rect x="136" y="226" width="16" height="26" rx="8" fill="#FDBA74" />
            <circle cx="146" cy="210" r="24" fill="#FDBA74" />

            {/* Stylized Hair & Glasses */}
            <path
              d="M 120 212 C 118 190, 134 178, 154 180 C 170 182, 176 196, 170 208 C 164 198, 152 196, 138 198 C 128 200, 124 206, 120 212 Z"
              fill="#1E293B"
            />
            {/* Glasses Frame */}
            <rect x="144" y="203" width="11" height="8" rx="2.5" stroke="#0F172A" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.35" />
            <rect x="159" y="203" width="10" height="8" rx="2.5" stroke="#0F172A" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.35" />
            <line x1="155" y1="207" x2="159" y2="207" stroke="#0F172A" strokeWidth="1.8" />
            {/* Friendly Smile */}
            <path d="M 150 220 Q 156 225 162 220" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Left Arm resting on desk towards laptop */}
            <path
              d="M 116 272 C 112 302, 126 326, 168 332"
              stroke="#B45309"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="172" cy="332" r="7.5" fill="#FDBA74" />

            {/* Right Arm gesturing toward central screen */}
            <path
              d="M 174 268 C 194 286, 212 296, 236 286"
              stroke="#F59E0B"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="240" cy="284" r="7.5" fill="#FDBA74" />
          </g>

          {/* ============================================================== */}
          {/* DEVELOPER 2 (CENTER): LEAD DEVELOPER AT DUAL WORKSTATION       */}
          {/* ============================================================== */}
          <g>
            {/* Central Ergonomic Chair */}
            <rect x="296" y="294" width="84" height="86" rx="18" fill="#1E293B" />
            <rect x="332" y="380" width="12" height="62" fill="#334155" />

            {/* Legs */}
            <rect x="314" y="364" width="20" height="80" rx="8" fill="#334155" />
            <rect x="344" y="364" width="20" height="80" rx="8" fill="#1E293B" />
            {/* Shoes */}
            <rect x="308" y="442" width="30" height="12" rx="6" fill="#0F172A" />
            <rect x="342" y="442" width="30" height="12" rx="6" fill="#0F172A" />

            {/* Torso (Deep Navy Tech Hoodie) */}
            <path
              d="M 284 266 C 284 244, 306 232, 338 232 C 370 232, 392 244, 392 266 L 398 356 L 278 356 Z"
              fill="url(#eraNavySweater)"
            />
            {/* Hoodie Accent Drawstrings & Collar */}
            <path d="M 322 232 L 338 252 L 354 232" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" fill="none" />
            <line x1="330" y1="246" x2="330" y2="272" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
            <line x1="346" y1="246" x2="346" y2="272" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />

            {/* Neck & Head */}
            <rect x="329" y="208" width="18" height="28" rx="9" fill="#FCD34D" />
            <circle cx="338" cy="192" r="25" fill="#FDE68A" />

            {/* Hair & Headphones */}
            <path
              d="M 312 192 C 310 168, 324 156, 342 158 C 360 160, 368 174, 364 192 C 358 178, 346 174, 332 175 C 320 176, 315 184, 312 192 Z"
              fill="#0F172A"
            />
            {/* Over-ear Developer Headphones */}
            <path
              d="M 311 192 C 311 164, 365 164, 365 192"
              stroke="#3B82F6"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="306" y="185" width="8" height="18" rx="4" fill="#2563EB" />
            <rect x="362" y="185" width="8" height="18" rx="4" fill="#2563EB" />

            {/* Eyes & Expression */}
            <circle cx="330" cy="193" r="2.2" fill="#0F172A" />
            <circle cx="346" cy="193" r="2.2" fill="#0F172A" />
            <path d="M 333 203 Q 338 207 344 203" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Arms typing toward central workstation */}
            <path
              d="M 290 262 C 276 292, 286 322, 312 332"
              stroke="#1E293B"
              strokeWidth="17"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 386 262 C 400 292, 390 322, 364 332"
              stroke="#1E293B"
              strokeWidth="17"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* ============================================================== */}
          {/* DEVELOPER 3 (RIGHT): SYSTEMS ARCHITECT WITH TABLET / LAPTOP    */}
          {/* ============================================================== */}
          <g>
            {/* Chair / Stool (Right) */}
            <rect x="524" y="314" width="60" height="74" rx="15" fill="#334155" />
            <rect x="548" y="388" width="12" height="54" fill="#475569" />
            <path d="M 526 442 L 582 442" stroke="#334155" strokeWidth="6" strokeLinecap="round" />

            {/* Legs */}
            <path
              d="M 516 362 L 496 446 L 514 446 L 538 362 Z"
              fill="#1E293B"
            />
            <path
              d="M 544 362 L 532 446 L 550 446 L 566 362 Z"
              fill="#0F172A"
            />
            {/* Shoes */}
            <rect x="488" y="444" width="28" height="11" rx="5.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="524" y="444" width="28" height="11" rx="5.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Torso (Royal Blue / Cobalt Collaborative Jacket) */}
            <path
              d="M 492 272 C 496 252, 514 242, 538 242 C 562 242, 578 254, 580 278 L 574 362 L 486 362 Z"
              fill="url(#eraBlueAccent)"
            />
            {/* Inner T-Shirt */}
            <path d="M 524 242 L 536 270 L 548 242 Z" fill="#F8FAFC" />

            {/* Neck & Head */}
            <rect x="528" y="218" width="16" height="26" rx="8" fill="#FDBA74" />
            <circle cx="534" cy="202" r="24" fill="#FDBA74" />

            {/* Hair (Curly / Modern Cut) */}
            <path
              d="M 512 196 C 510 176, 526 166, 546 170 C 564 174, 568 192, 558 206 C 556 192, 546 186, 532 186 C 520 186, 515 191, 512 196 Z"
              fill="#0F172A"
            />
            <circle cx="556" cy="182" r="9" fill="#0F172A" />

            {/* Facial Features */}
            <circle cx="523" cy="202" r="2.2" fill="#0F172A" />
            <circle cx="536" cy="202" r="2.2" fill="#0F172A" />
            <path d="M 525 212 Q 530 216 536 212" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Right Arm pointing toward Central IDE Monitor */}
            <path
              d="M 502 264 C 478 278, 456 282, 434 272"
              stroke="#2563EB"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="430" cy="270" r="7.5" fill="#FDBA74" />

            {/* Left Arm working on Laptop */}
            <path
              d="M 564 268 C 572 298, 554 324, 520 330"
              stroke="#1D4ED8"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="516" cy="330" r="7.5" fill="#FDBA74" />
          </g>

          {/* ============================================================== */}
          {/* SHARED COLLABORATIVE WORKSPACE DESK & LAPTOPS / MONITORS       */}
          {/* ============================================================== */}
          <g>
            {/* Central Widescreen IDE Monitor (Behind Laptop / On Desk Stand) */}
            <g filter="url(#eraSoftShadow)">
              {/* Monitor Stand */}
              <rect x="330" y="318" width="20" height="28" fill="#64748B" />
              <path d="M 308 346 L 372 346" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Monitor Frame */}
              <rect
                x="252"
                y="214"
                width="176"
                height="108"
                rx="10"
                fill="url(#eraScreenGrad)"
                stroke="#334155"
                strokeWidth="3"
              />
              {/* Monitor Top Bar */}
              <rect x="256" y="218" width="168" height="14" rx="4" fill="#0F172A" />
              <circle cx="266" cy="225" r="2.5" fill="#EF4444" />
              <circle cx="274" cy="225" r="2.5" fill="#F59E0B" />
              <circle cx="282" cy="225" r="2.5" fill="#10B981" />
              <rect x="296" y="222" width="54" height="6" rx="3" fill="#334155" />

              {/* Left Sidebar inside IDE */}
              <rect x="258" y="236" width="34" height="80" rx="4" fill="#0F172A" opacity="0.6" />
              <rect x="263" y="244" width="22" height="4" rx="2" fill="#475569" />
              <rect x="263" y="253" width="18" height="4" rx="2" fill="#3B82F6" />
              <rect x="263" y="262" width="24" height="4" rx="2" fill="#475569" />
              <rect x="263" y="271" width="16" height="4" rx="2" fill="#475569" />

              {/* Main Code Canvas inside Central Monitor */}
              <rect
                x="300"
                y="242"
                width="52"
                height="6"
                rx="3"
                fill="#F59E0B"
                className={animClass('hero-anim-code-1')}
              />
              <rect
                x="358"
                y="242"
                width="46"
                height="6"
                rx="3"
                fill="#38BDF8"
                className={animClass('hero-anim-code-2')}
              />
              <rect
                x="308"
                y="254"
                width="84"
                height="6"
                rx="3"
                fill="#94A3B8"
                className={animClass('hero-anim-code-3')}
              />
              <rect
                x="308"
                y="266"
                width="64"
                height="6"
                rx="3"
                fill="#34D399"
                className={animClass('hero-anim-code-1')}
              />
              <rect
                x="300"
                y="278"
                width="42"
                height="6"
                rx="3"
                fill="#F59E0B"
              />

              {/* Live Terminal Strip at bottom of IDE */}
              <rect x="298" y="292" width="120" height="22" rx="4" fill="#090D16" />
              <circle cx="308" cy="303" r="3" fill="#10B981" />
              <rect x="316" y="300" width="68" height="6" rx="3" fill="#334155" />
              <rect x="390" y="299" width="20" height="8" rx="4" fill="#065F46" />
            </g>

            {/* Left Developer's Open Laptop */}
            <g filter="url(#eraSoftShadow)">
              <path
                d="M 150 294 L 224 294 C 228 294, 230 297, 229 301 L 220 344 L 142 344 L 145 299 C 145 296, 147 294, 150 294 Z"
                fill="url(#eraLaptopLid)"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              {/* glowing Apple/Era emblem on laptop lid */}
              <circle cx="185" cy="318" r="5" fill="#FFFFFF" opacity="0.85" />
              <rect x="132" y="342" width="96" height="5" rx="2.5" fill="#94A3B8" />
            </g>

            {/* Right Developer's Open Laptop */}
            <g filter="url(#eraSoftShadow)">
              <path
                d="M 454 294 L 528 294 C 531 294, 533 296, 533 299 L 536 344 L 458 344 L 449 301 C 448 297, 450 294, 454 294 Z"
                fill="url(#eraLaptopLid)"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              <circle cx="493" cy="318" r="5" fill="#FFFFFF" opacity="0.85" />
              <rect x="450" y="342" width="96" height="5" rx="2.5" fill="#94A3B8" />
            </g>

            {/* Coffee Mug & Steam on Desk */}
            <g>
              <path
                d="M 600 318 C 600 313, 605 310, 605 305"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className={animClass('hero-anim-steam-1')}
              />
              <path
                d="M 609 316 C 609 311, 614 308, 614 303"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className={animClass('hero-anim-steam-2')}
              />
              <rect x="594" y="322" width="22" height="24" rx="4" fill="#F59E0B" />
              <path
                d="M 616 327 C 622 327, 622 339, 616 339"
                stroke="#D97706"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Stack of Engineering Notebooks (Left Edge of Desk) */}
            <rect x="64" y="336" width="52" height="6" rx="3" fill="#3B82F6" />
            <rect x="68" y="330" width="46" height="6" rx="3" fill="#F59E0B" />

            {/* Main Collaborative Desk Surface */}
            <rect x="44" y="346" width="592" height="12" rx="6" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
            {/* Desk Legs */}
            <rect x="78" y="358" width="12" height="104" rx="4" fill="#CBD5E1" />
            <rect x="590" y="358" width="12" height="104" rx="4" fill="#CBD5E1" />
            <rect x="84" y="358" width="512" height="6" fill="#CBD5E1" opacity="0.6" />
          </g>

          {/* ============================================================== */}
          {/* FLOATING CARD 4 (BOTTOM FOREGROUND): SPRINT / BUILD STATUS     */}
          {/* ============================================================== */}
          <g className={animClass('hero-anim-float-subtle')} filter="url(#eraCardShadow)">
            <rect
              x="216"
              y="404"
              width="248"
              height="52"
              rx="12"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            {/* Status Icon Circle */}
            <circle cx="244" cy="430" r="14" fill="#FEF3C7" />
            <path
              d="M 239 430 L 243 434 L 250 426"
              stroke="#D97706"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Progress Labels & Bar */}
            <rect x="268" y="418" width="92" height="7" rx="3.5" fill="#0F172A" />
            <rect x="412" y="418" width="34" height="7" rx="3.5" fill="#10B981" />
            {/* Progress Track */}
            <rect x="268" y="434" width="178" height="7" rx="3.5" fill="#F1F5F9" />
            <rect
              x="268"
              y="434"
              width="148"
              height="7"
              rx="3.5"
              fill="url(#eraAmberAccent)"
              className={animClass('hero-anim-code-2')}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HeroAnimation;
