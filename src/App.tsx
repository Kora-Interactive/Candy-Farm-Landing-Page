import { useState, useRef } from 'react'

import logoSplash from './assets/Candy Farm Logo2.png'
import islandAdventure from './assets/candy-farm-island.png'
import redShooter from './assets/ChatGPT Image Sep 18, 2026, 07_57_00 AM.png'
import slashShooter from './assets/ChatGPT Image Aug 28, 2025, 04_01_36 AM-Photoroom.png'
import orangeShooter from './assets/ChatGPT Image Aug 31, 2025, 03_18_57 PM.png'
import screenshotA from './assets/asset5.png'   // main menu (farm world)
import screenshotB from './assets/asset2.png'   // rewards screen
import screenshotC from './assets/asset4.png'   // gameplay catching
import screenshotD from './assets/asset6.png'  // store screen
import screenshotE from './assets/asset10.png'  // gameplay 2

const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.Precious.CandyFarm'

const SCREENSHOTS = [screenshotA, screenshotB, screenshotC, screenshotD, screenshotE]

function CarouselDot({ active }: { active: boolean }) {
  return (
    <div
      className={`rounded-full transition-all duration-300 ${active ? 'w-6 h-3 bg-candy-pink' : 'w-3 h-3 bg-[#8bab83]'
        }`}
    />
  )
}

function SocialIcon({ name }: { name: 'x' | 'linkedin' | 'instagram' | 'tiktok' }) {
  if (name === 'x') {
    return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M18.244 2H21.5l-7.11 8.13L22.76 22h-6.604l-5.17-6.76L5.07 22H1.812l7.607-8.7L1.24 2H8.01l4.673 6.18L18.244 2Zm-1.145 17.86h1.803L6.978 4.02H5.044L17.1 19.86Z" /></svg>
  }
  if (name === 'linkedin') {
    return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M4.98 3.5A2.48 2.48 0 1 1 5 8.46a2.48 2.48 0 0 1-.02-4.96ZM3 9.75h4v11.75H3V9.75Zm6.25 0h3.83v1.61h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v6.1h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5h-4V9.75Z" /></svg>
  }
  if (name === 'instagram') {
    return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.7" r="1" className="fill-current stroke-none" /></svg>
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M14.2 3h3.03c.2 1.74 1.17 2.72 2.77 2.83v3.02c-1.02.1-1.94-.23-2.74-.7v6.2c0 4.73-5.14 6.3-8.16 3.6-2.17-1.94-1.36-5.7 1.48-6.78.75-.28 1.38-.2 2.05-.02v3.14c-2.08-.63-2.75 1.18-1.7 2.05 1.07.89 3.15.31 3.15-1.4L14.2 3Z" /></svg>
}

function Butterfly({ className = '', color = 'pink' }: { className?: string; color?: 'pink' | 'gold' | 'mint' }) {
  return (
    <span aria-hidden="true" className={`butterfly butterfly-${color} ${className}`}>
      <span className="butterfly-wing butterfly-wing-left" />
      <span className="butterfly-body" />
      <span className="butterfly-wing butterfly-wing-right" />
    </span>
  )
}

export default function App() {
  const [carouselIdx, setCarouselIdx] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  function scrollCarousel(dir: number) {
    const next = Math.max(0, Math.min(SCREENSHOTS.length - 1, carouselIdx + dir))
    setCarouselIdx(next)
    carouselRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  function onCarouselScroll() {
    if (!carouselRef.current) return
    const el = carouselRef.current
    const center = el.getBoundingClientRect().left + el.clientWidth / 2
    const closest = Array.from(el.children).reduce(
      (best, child, index) => {
        const bounds = child.getBoundingClientRect()
        const distance = Math.abs(bounds.left + bounds.width / 2 - center)
        return distance < best.distance ? { index, distance } : best
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    )
    setCarouselIdx(closest.index)
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="top" className="relative isolate overflow-hidden bg-[#68c9ec]">
        <img
          src={islandAdventure}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,61,36,0.82)_0%,rgba(13,75,39,0.66)_35%,rgba(12,64,37,0.15)_73%,transparent_100%),linear-gradient(0deg,rgba(7,47,37,0.58)_0%,transparent_38%,rgba(5,52,78,0.3)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#073a65]/30 to-transparent" />

        <header className="relative z-20 px-4 pt-4 sm:px-6 sm:pt-6">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/75 bg-white/90 px-4 py-2 shadow-[0_10px_32px_rgba(30,66,64,0.18)] backdrop-blur-md sm:px-6"
          >
            <a href="#top" className="flex items-center gap-2 text-[#28532c] no-underline" aria-label="Candy Farm home">
              <img src={logoSplash} alt="" fetchPriority="high" decoding="async" className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
              <span className="candy-wordmark text-lg sm:text-xl">Candy Farm</span>
            </a>

            <div className="hidden items-center gap-8 text-sm font-extrabold text-[#355a36] md:flex">
              <a href="#how-it-works" className="transition-colors hover:text-[#ec5b55]">The adventure</a>
              <a href="#gameplay" className="transition-colors hover:text-[#ec5b55]">See the game</a>
              <a href="#community" className="transition-colors hover:text-[#ec5b55]">Community</a>
            </div>

            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="candy-wordmark rounded-full bg-[#ffcf35] px-4 py-2.5 text-xs text-[#643e16] shadow-[0_4px_0_#df951b] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 sm:px-6 sm:text-sm"
              style={{ textDecoration: 'none' }}
            >
              Play for free <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[760px] w-full max-w-7xl items-center gap-8 px-5 pb-24 pt-16 sm:px-8 lg:min-h-[800px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-0 lg:pb-28 lg:pt-12">
          <div className="hero-copy-pop max-w-2xl pt-5 text-center lg:pt-0 lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/45 bg-[#164f34]/65 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#fff4b4] shadow-lg backdrop-blur-sm sm:text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffcf35]" />
              Your next happy place
            </div>
            <h1 className="candy-title max-w-2xl text-5xl uppercase leading-[0.94] text-white drop-shadow-[0_4px_0_rgba(50,91,39,0.8)] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              A little farm.<br />
              <span className="candy-title-gradient">A lot of fun.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base font-extrabold leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(13,47,34,0.7)] sm:text-lg lg:mx-0">
              Step into a world made of wonder. Collect sweet surprises, take on playful challenges, and explore a farm that’s bursting with color.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-candy inline-flex items-center justify-center gap-2 rounded-full bg-[#ffcc36] px-7 py-4 text-sm font-black text-[#593d18] shadow-[0_6px_0_#d98b21,0_12px_24px_rgba(29,52,24,0.26)] transition-transform hover:-translate-y-1 active:translate-y-1 sm:text-base"
                style={{ textDecoration: 'none' }}
              >
                <span aria-hidden="true">▶</span> Play on Google Play
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/15 px-7 py-4 text-sm font-black text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:text-base"
                style={{ textDecoration: 'none' }}
              >
                Explore the farm <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-black uppercase tracking-wider text-white drop-shadow sm:text-sm lg:justify-start">
              <span>🍬 Collect</span>
              <span className="text-[#ffda4e]">✦</span>
              <span>🌱 Grow</span>
              <span className="text-[#ffda4e]">✦</span>
              <span>🎯 Play</span>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[400px] items-center justify-center lg:justify-end">
            <div className="community-ring absolute left-4 top-8 h-20 w-20 rounded-full border-[12px] border-[#ffe567]/80 lg:left-10" />
            <div className="float-anim relative z-10 w-[min(55vw,245px)] rotate-[4deg] rounded-[2.3rem] border-[7px] border-[#fff5d7] bg-[#fff5d7] p-1.5 shadow-[0_28px_70px_rgba(14,56,39,0.45)] sm:w-[245px]">
              <div className="overflow-hidden rounded-[1.7rem]">
                <img
                  src={screenshotA}
                  alt="A peek at the Candy Farm game"
                  loading="eager"
                  decoding="async"
                  className="aspect-[9/19] w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 left-0 z-20 -rotate-3 rounded-2xl border-2 border-white/80 bg-[#ff765b] px-4 py-3 text-white shadow-xl sm:left-4">
              <p className="candy-title text-sm uppercase sm:text-base">Ready, set, sweet!</p>
              <p className="text-[10px] font-extrabold text-white/85 sm:text-xs">A colorful arcade adventure</p>
            </div>
            <div className="wiggle absolute -right-1 top-12 z-20 grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-[#ffcb36] text-3xl shadow-lg sm:-right-2 sm:h-16 sm:w-16">🍭</div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#f8f0d2]/75 to-transparent" />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative overflow-hidden px-4 py-16 sm:py-20"
        style={{ background: 'radial-gradient(circle at 10% 10%, rgba(255,217,61,0.23), transparent 22%), linear-gradient(180deg, #fff9e8 0%, #e5f9e9 100%)' }}
      >
        {/* section label */}
        <div className="flex justify-center mb-2">
          <span
            className="rounded-full px-5 py-1.5 text-xs font-800 uppercase tracking-widest"
            style={{
              fontWeight: 800,
              background: '#e7f2d6',
              color: '#518340',
              letterSpacing: '0.12em',
            }}
          >
            THE CANDY ARMORY
          </span>
        </div>
        <h2
          className="candy-title mb-10 text-center text-3xl leading-tight text-[#24513a] sm:text-4xl"
          style={{
            fontWeight: 900,
            textShadow: '0 2px 0 rgba(255,255,255,0.8)',
          }}
        >
          Pick your weapon.<br /><span className="candy-title-gradient">Protect the farm.</span>
        </h2>

        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            {
              emoji: '🌱',
              step: '01',
              title: 'Plant Candy Crops',
              desc: 'Sow magical candy seeds across your farm and watch sugary wonders grow in every season.',
              color: '#FF6B9D',
              shadow: 'rgba(255,107,157,0.4)',
            },
            {
              emoji: '🍭',
              step: '02',
              title: 'Collect & Upgrade',
              desc: 'Harvest gummy balls, lollipops, and rare candy gems. Use them to power up your basket and unlock boosters.',
              color: '#F2B632',
              shadow: 'rgba(242,182,50,0.4)',
            },
            {
              emoji: '🗺️',
              step: '03',
              title: 'Unlock New Farm Areas',
              desc: 'Explore wave, evasion, target, and turret modes. Expand your candy empire across enchanted lands!',
              color: '#FFD93D',
              shadow: 'rgba(245,166,35,0.4)',
            },
          ].map(({ emoji, step, title, desc, color, shadow }) => (
            <div
              key={step}
              className="rounded-3xl p-5 flex items-start gap-4 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.92)',
                boxShadow: `0 10px 30px ${shadow}, 0 2px 0 rgba(255,255,255,0.8) inset`,
              }}
            >
              {/* step number watermark */}
              <div
                className="absolute top-2 right-4 font-900 text-5xl leading-none select-none"
                style={{ fontWeight: 900, color: `${color}20` }}
              >
                {step}
              </div>
              <div
                className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
                  boxShadow: `0 4px 12px ${shadow}`,
                  border: `2px solid ${color}44`,
                }}
              >
                {emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="candy-title text-base mb-1"
                  style={{ fontWeight: 900, color: '#2D1A00' }}
                >
                  {title}
                </h3>
                <p className="text-sm font-600 leading-snug" style={{ fontWeight: 600, color: '#6B4C1E' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="armory-glow relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border border-[#7dbf68] bg-[#285f43] px-5 pb-5 pt-6 shadow-[0_18px_50px_rgba(41,94,57,0.24)]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#ff6b72] via-[#f4b942] to-[#37cbb7]" />
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffe16a]">Pick your favourite</p>
              <h3 className="candy-title mt-1 text-2xl uppercase text-white">Sweet shooters</h3>
            </div>
            <span className="hidden border border-[#E34232]/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF887D] sm:block">3 launchers unlocked</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-5">
            {[
              { src: slashShooter, name: 'Ripper', color: '#E34232', detail: 'Critical hit' },
              { src: redShooter, name: 'Skullshot', color: '#FF4C3E', detail: 'Cursed candy' },
              { src: orangeShooter, name: 'Blazebite', color: '#F28C28', detail: 'Area burst' },
            ].map(({ src, name, color, detail }) => (
              <div key={name} className="loadout-card group relative flex min-h-52 flex-col items-center justify-end overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#315451] to-[#101D25] pt-2 transition-transform hover:-translate-y-1">
                <img src={src} alt={`${name} candy shooter`} loading="lazy" decoding="async" className="h-40 w-full object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.7)] sm:h-52" />
                <div className="relative z-10 w-full border-t px-3 py-2" style={{ borderColor: `${color}88` }}>
                  <p className="candy-title text-xs uppercase text-white sm:text-sm">{name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOTS CAROUSEL ─────────────────────────────── */}
      <section
        id="gameplay"
        className="overflow-hidden py-16 sm:py-20"
        style={{ background: 'radial-gradient(circle at 80% 10%, rgba(255,211,91,0.34), transparent 20%), linear-gradient(180deg, #fff0ce 0%, #fff9e9 48%, #e5f8e9 100%)' }}
      >
        <div className="flex justify-center mb-2">
          <span
            className="rounded-full px-5 py-1.5 text-xs font-800 uppercase tracking-widest"
            style={{
              fontWeight: 800,
              background: '#e1f1d9',
              color: '#4f8343',
              letterSpacing: '0.12em',
            }}
          >
            GAMEPLAY PREVIEW
          </span>
        </div>
        <h2
          className="candy-title mb-8 px-4 text-center text-3xl text-[#285b3e] sm:text-4xl"
          style={{ fontWeight: 900, textShadow: '0 2px 0 rgba(255,255,255,0.8)' }}
        >
          Take a peek inside Candy Farm.
        </h2>

        {/* Carousel */}
        <div
          ref={carouselRef}
          onScroll={onCarouselScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
          style={{ paddingLeft: 'calc(50% - 36vw)', paddingRight: 'calc(50% - 36vw)' }}
        >
          {SCREENSHOTS.map((src, i) => (
            <div
              key={i}
              className="gameplay-card flex-shrink-0 snap-center rounded-3xl overflow-hidden transition-all duration-300"
              style={{
                width: '72vw',
                maxWidth: 280,
                aspectRatio: '9/19',
                boxShadow:
                  i === carouselIdx
                    ? '0 16px 42px rgba(57,89,57,0.24), 0 0 0 4px rgba(255,107,157,0.85)'
                    : '0 8px 24px rgba(57,89,57,0.16)',
                transform: i === carouselIdx ? 'scale(1)' : 'scale(0.92)',
              }}
            >
              <img
                src={src}
                alt={`Candy Farm gameplay screenshot ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Dots + arrows */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => scrollCarousel(-1)}
            aria-label="Previous screenshot"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c704d] font-900 text-white transition-all hover:bg-[#1c583b] active:scale-90"
            style={{ fontWeight: 900 }}
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            {SCREENSHOTS.map((_, i) => <CarouselDot key={i} active={i === carouselIdx} />)}
          </div>
          <button
            onClick={() => scrollCarousel(1)}
            aria-label="Next screenshot"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c704d] font-900 text-white transition-all hover:bg-[#1c583b] active:scale-90"
            style={{ fontWeight: 900 }}
          >
            ›
          </button>
        </div>

        <p className="mt-3 text-center text-xs font-700 text-[#648269]" style={{ fontWeight: 700 }}>
          Swipe through the sweet little world
        </p>
      </section>

      {/* ── COMMUNITY ────────────────────────────────────────── */}
      <section id="community" className="relative overflow-hidden border-t-4 border-[#F4B942] px-4 py-20" style={{ background: 'radial-gradient(circle at 12% 5%, rgba(227,66,50,0.32), transparent 28%), linear-gradient(135deg, #21121A 0%, #111A2A 52%, #092F38 100%)' }}>
        <div className="community-ring absolute -right-20 top-10 h-64 w-64 rounded-full border-[28px] border-[#FF5948]/25" />
        <div className="community-ring absolute -left-24 bottom-[-90px] h-72 w-72 rounded-full border-[30px] border-[#4DF5E8]/20" style={{ animationDelay: '1.2s' }} />
        <Butterfly color="pink" className="butterfly-four absolute right-[14%] top-[18%]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 border border-[#E34232]/70 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#FF887D]">
                <span className="h-2 w-2 rounded-full bg-[#E34232] shadow-[0_0_12px_#E34232]" /> Squad HQ
              </div>
              <h2 className="candy-title max-w-xl text-4xl uppercase leading-[0.95] text-white sm:text-6xl" style={{ textShadow: '4px 5px 0 #9F3028' }}>
                Join the sweetest<br /><span className="candy-title-gradient">gaming community.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm font-bold leading-relaxed text-[#C8DCD9] sm:text-base">
                Share your adventures, swap loadout tips, and keep up with new candy islands and game updates. Rally your squad and protect the farm together.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-[#F4B942]">
                <span className="border border-[#F4B942]/40 bg-[#F4B942]/10 px-3 py-2">Game updates</span>
                <span className="border border-[#37D5D0]/40 bg-[#37D5D0]/10 px-3 py-2 text-[#72F2E8]">Squad events</span>
                <span className="border border-[#E34232]/40 bg-[#E34232]/10 px-3 py-2 text-[#FF887D]">Candy drops</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="https://chat.whatsapp.com/ETDLGETaVmN1xHYIibTfV6?s=sh&p=a&mlu=0&ilr=4"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-candy flex items-center justify-center gap-3 rounded-xl border border-[#5AF18A]/50 py-4 font-900 text-base transition-transform active:scale-95"
                style={{
                  fontWeight: 900,
                  background: 'linear-gradient(180deg, #25D366 0%, #128C3E 100%)',
                  color: 'white',
                  boxShadow: '0 6px 0 #0A5C28, 0 8px 24px rgba(18,140,62,0.5)',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.618.68 5.076 1.868 7.21L2 30l7.04-1.838A13.934 13.934 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="white" />
                  <path d="M22.5 19.5c-.3-.15-1.8-.9-2.1-1-.3-.1-.5-.15-.7.15-.2.3-.8 1-.95 1.2-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.7-1.68-.95-2.3-.25-.6-.5-.52-.7-.53-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.02 1-1.02 2.45s1.05 2.84 1.2 3.04c.15.2 2.06 3.14 4.99 4.4.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.11.56-.08 1.8-.73 2.05-1.44.25-.7.25-1.3.17-1.44-.08-.14-.3-.22-.6-.37z" fill="#25D366" />
                </svg>
                Join our WhatsApp Community
              </a>

              <a
                href="https://t.me/+eRNrjmhzDrhhMGRk"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-candy flex items-center justify-center gap-3 rounded-xl border border-[#55C9FF]/50 py-4 font-900 text-base transition-transform active:scale-95"
                style={{
                  fontWeight: 900,
                  background: 'linear-gradient(180deg, #40A8E8 0%, #0B74BE 100%)',
                  color: 'white',
                  boxShadow: '0 6px 0 #074F8A, 0 8px 24px rgba(11,116,190,0.5)',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="white" />
                  <path d="M22.94 10.27l-2.34 11.02c-.17.77-.63.96-1.27.6l-3.5-2.58-1.69 1.63c-.19.19-.35.35-.71.35l.25-3.55 6.48-5.86c.28-.25-.06-.39-.43-.14L9.5 17.3l-3.43-1.07c-.75-.23-.76-.75.16-1.1l13.4-5.17c.62-.23 1.17.14.96 1.1l-.65.01z" fill="#40A8E8" />
                </svg>
                Join our Telegram Group
              </a>

            </div>
          </div>
          <div className="mt-14 flex items-center gap-4 border-t border-white/10 pt-6">
            <div className="flex -space-x-2">
              {['CF', 'HQ', 'GG', 'XP'].map((label, i) => <div key={label} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111A2A] text-[10px] font-black text-white" style={{ background: ['#E34232', '#F4B942', '#37D5D0', '#7D6BFF'][i] }}>{label}</div>)}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-[#B7C9C7]">Farmers already waiting in the lobby</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#071216] px-5 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={logoSplash} alt="Candy Farm" loading="lazy" decoding="async" className="h-14 w-14 object-contain" />
              <div>
                <p className="candy-wordmark text-xl uppercase text-white">Candy Farm</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7E9B99]">by Kora Interactive</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="mr-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7E9B99]">Follow the farm</span>
              {[
                { name: 'x' as const, label: 'X', href: '#' },
                { name: 'linkedin' as const, label: 'LinkedIn', href: '#' },
                { name: 'instagram' as const, label: 'Instagram', href: '#' },
                { name: 'tiktok' as const, label: 'TikTok', href: '#' },
              ].map(({ name, label, href }) => <a key={name} href={href} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-[#D9F4E8] transition-colors hover:border-[#F4B942] hover:bg-[#F4B942] hover:text-[#111A2A]"><SocialIcon name={name} /></a>)}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-widest text-[#68817F] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['Privacy Policy', 'Terms of Use', 'Contact'].map(link => <a key={link} href="#" className="transition-colors hover:text-white">{link}</a>)}
            </div>
            <p>© {new Date().getFullYear()} Kora Interactive · Candy Farm for Android</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
