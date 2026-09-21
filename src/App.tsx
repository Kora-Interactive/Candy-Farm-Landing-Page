import { useState, useRef } from 'react'

import logoSplash from './assets/Candy Farm Logo2.png'
import worldMap from './assets/ChatGPT Image Sep 17, 2026, 06_25_31 AM.png'
import redShooter from './assets/ChatGPT Image Sep 18, 2026, 07_57_00 AM.png'
import slashShooter from './assets/ChatGPT Image Aug 28, 2025, 04_01_36 AM-Photoroom.png'
import orangeShooter from './assets/ChatGPT Image Aug 31, 2025, 03_18_57 PM.png'
import screenshotA from './assets/asset5.png'   // main menu (farm world)
import screenshotB from './assets/asset2.png'   // rewards screen
import screenshotC from './assets/asset4.png'   // gameplay catching
import screenshotD from './assets/asset6.png'   // store screen
import screenshotE from './assets/asset10.png'  // gameplay 2

const PLAYTEST_URL = 'https://play.google.com/apps/testing/com.Precious.CandyFarm'
const TESTER_GROUP_URL = 'https://groups.google.com/g/candy-farm-closed-test'
const SIGNUP_ENDPOINT = '/api/signups'

async function saveSignup(signup: { name: string; email: string; phone: string; country: string }): Promise<{ row: number; groupAdded: boolean }> {
  const res = await fetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(signup),
  })
  const result = await res.json().catch(() => null)
  if (!res.ok || result?.ok === false) throw new Error(result?.error || `Signup request failed (${res.status})`)
  if (!Number.isInteger(result?.row) || result.row < 2) {
    throw new Error('Google Sheets did not confirm that the signup was written. Redeploy the Apps Script Web App.')
  }
  return { row: result.row, groupAdded: result.groupAdded === true }
}

const SCREENSHOTS = [screenshotA, screenshotB, screenshotC, screenshotD, screenshotE]

function CarouselDot({ active }: { active: boolean }) {
  return (
    <div
      className={`rounded-full transition-all duration-300 ${active ? 'w-6 h-3 bg-candy-pink' : 'w-3 h-3 bg-white/50'
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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [groupConsent, setGroupConsent] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState('')
  const [carouselIdx, setCarouselIdx] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !phone || !country || !groupConsent) return
    setSubmitState('loading')
    setSubmitError('')
    try {
      await saveSignup({ name, email, phone, country })
      setSubmitState('success')
    } catch (error) {
      setSubmitState('error')
      setSubmitError(error instanceof Error ? error.message : 'Signup could not be saved')
      console.error('Candy Farm signup failed:', error)
    }
  }

  function scrollCarousel(dir: number) {
    const next = Math.max(0, Math.min(SCREENSHOTS.length - 1, carouselIdx + dir))
    setCarouselIdx(next)
    carouselRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  function onCarouselScroll() {
    if (!carouselRef.current) return
    const el = carouselRef.current
    const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.72))
    setCarouselIdx(Math.max(0, Math.min(SCREENSHOTS.length - 1, idx)))
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center text-center overflow-hidden border-b-4 border-[#E34232]"
        style={{
          background: '#071B1A',
        }}
      >
        <img src={worldMap} alt="Candy Farm world map" fetchPriority="high" decoding="async" className="map-pulse absolute inset-0 h-full w-full object-cover opacity-95" onError={event => { event.currentTarget.style.display = 'none' }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,20,0.78)_0%,rgba(5,20,20,0.48)_34%,rgba(5,20,20,0.02)_76%),linear-gradient(0deg,rgba(7,27,26,0.78)_0%,transparent_48%,rgba(4,16,16,0.35)_100%)]" />
        {/* ── HEADER ───────────────────────────────────────────── */}
        <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 sm:pt-5">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-xl border border-[#F4B942]/55 bg-[#071817]/85 px-4 py-2.5 shadow-[0_8px_26px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-5"
          >
            <a
              href="#top"
              className="flex items-center gap-2 text-white no-underline drop-shadow-sm"
              aria-label="Candy Farm home"
            >
              <img src={logoSplash} alt="Candy Farm" fetchPriority="high" decoding="async" className="h-10 w-10 object-contain drop-shadow-sm" />
              <span className="candy-wordmark hidden text-base sm:inline sm:text-lg">
                Candy Farm
              </span>
            </a>

            <div className="hidden items-center gap-6 text-sm font-800 text-[#FFE8B0] md:flex" style={{ fontWeight: 800 }}>
              <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
              <a href="#gameplay" className="transition-colors hover:text-white">Gameplay</a>
              <a href="#community" className="transition-colors hover:text-white">Community</a>
            </div>

            <a
              href="#signup"
              className="candy-wordmark rounded-full bg-candy-yellow px-4 py-2 text-xs text-[#7A3F00] shadow-[0_3px_0_#C07000] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 sm:px-5 sm:text-sm"
              style={{ fontWeight: 900, textDecoration: 'none' }}
            >
              Join the beta
            </a>
          </nav>
        </header>

        {/* map atmosphere */}
        <div className="signal-pulse absolute right-0 top-24 hidden h-2 w-32 bg-[#FFE45C] shadow-[0_0_24px_#FFE45C] sm:block" />
        <div className="signal-pulse absolute left-0 top-36 hidden h-2 w-20 bg-[#FF5948] shadow-[0_0_24px_#FF5948] sm:block" style={{ animationDelay: '0.8s' }} />

        <div className="absolute right-[28%] top-[38%] z-10 hidden h-4 w-4 rounded-full bg-[#FFE45C] shadow-[0_0_22px_8px_rgba(255,228,92,0.75)] projectile-one lg:block" />
        <div className="absolute right-[18%] top-[45%] z-10 hidden h-3 w-3 rounded-full bg-[#FF5948] shadow-[0_0_20px_7px_rgba(255,89,72,0.75)] projectile-two lg:block" />
        <img src={redShooter} alt="Candy Farm skull shooter" loading="eager" decoding="async" className="shooter-float absolute -right-20 bottom-[-10px] z-10 block h-[42vh] max-h-[430px] w-auto object-contain opacity-80 drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] sm:h-[56vh] sm:max-h-[560px] lg:bottom-[-30px] lg:h-[78vh] lg:max-h-[720px] lg:opacity-95" />
        <Butterfly color="gold" className="butterfly-one absolute left-[14%] top-[30%] z-10" />
        <Butterfly color="pink" className="butterfly-two absolute right-[36%] top-[22%] z-10" />
        <Butterfly color="mint" className="butterfly-three absolute left-[44%] top-[58%] z-10" />

        {/* Logo / mascot */}
        <div className="relative z-10 mt-20 w-full max-w-6xl px-5 text-left sm:mt-28 lg:mt-32">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 border border-[#F4B942]/70 bg-[#111E1D]/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#F4B942]">
              <span className="h-2 w-2 rounded-full bg-[#E34232] shadow-[0_0_10px_#E34232]" /> Live battle map unlocked
            </div>
            <div className="float-anim w-full max-w-[260px] sm:max-w-[330px]">
              <img
                src={logoSplash}
                alt="Candy Farm - official game logo with gummy bear mascot"
                fetchPriority="high"
                decoding="async"
                className="w-full min-w-0 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.65))' }}
              />
            </div>

            <p className="candy-title hero-copy-pop mt-4 max-w-lg text-3xl uppercase leading-[0.95] text-white sm:text-5xl" style={{ textShadow: '3px 4px 0 #A62B24' }}>
              Farm hard.<br />Shoot sweet.
            </p>
            <p className="mt-4 max-w-md text-sm font-bold leading-relaxed text-[#D7F6E8] sm:text-base">
              Build your candy farm, load your launcher, and defend the islands from cursed sweets in a colorful arcade adventure.
            </p>
          </div>
        </div>

        {/* Closed beta signup card */}
        <div id="signup" className="relative z-20 mt-6 w-full max-w-sm scroll-mt-6 px-4 lg:absolute lg:bottom-8 lg:left-1/2 lg:ml-[-12rem] lg:mt-0">
          <div
            className="rounded-3xl p-5"
            style={{
              background: 'linear-gradient(135deg, #C52C29 0%, #E34232 52%, #F28C28 100%)',
              boxShadow: '0 14px 38px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.42)',
            }}
          >
            {/* inner gloss strip */}
            <div className="rounded-t-2xl h-1 mb-3 mx-auto w-3/4 bg-white/25" />
            <h2 className="candy-title text-white text-lg mb-1">
              🎮 Join the Closed Beta!
            </h2>
            <p className="text-white/85 text-sm mb-4" style={{ fontWeight: 600 }}>
              Be first to play. Join the farm and we'll add you to the Play Store testing list.
            </p>

            {submitState === 'success' ? (
              <div className="rounded-2xl bg-white/20 px-3 py-4 text-center text-white">
                <p className="candy-title text-lg">🎉 Your signup is saved!</p>
                <p className="mt-1 text-xs font-semibold text-white/85">Join the tester group, then open Google Play with the same Google account.</p>
                <div className="mt-4 grid gap-2">
                  <a href={TESTER_GROUP_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white px-3 py-3 text-sm font-black text-[#173D38]">Join the Google tester group</a>
                  <a href={PLAYTEST_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#FFE45C] px-3 py-3 text-sm font-black text-[#7A3F00]">Open Google Play testing</a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  aria-label="Your name"
                  className="w-full rounded-2xl px-4 py-3 text-sm font-700 outline-none border-2 border-transparent focus:border-white/60 transition-colors"
                  style={{ fontWeight: 700, background: 'rgba(255,255,255,0.92)', color: '#3A1F00' }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address"
                  className="w-full rounded-2xl px-4 py-3 text-sm font-700 outline-none border-2 border-transparent focus:border-white/60 transition-colors"
                  style={{
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.92)',
                    color: '#3A1F00',
                  }}
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number"
                  aria-label="Phone number"
                  className="w-full rounded-2xl px-4 py-3 text-sm font-700 outline-none border-2 border-transparent focus:border-white/60 transition-colors"
                  style={{ fontWeight: 700, background: 'rgba(255,255,255,0.92)', color: '#3A1F00' }}
                />
                <input
                  type="text"
                  required
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Country"
                  aria-label="Country"
                  className="w-full rounded-2xl px-4 py-3 text-sm font-700 outline-none border-2 border-transparent focus:border-white/60 transition-colors"
                  style={{ fontWeight: 700, background: 'rgba(255,255,255,0.92)', color: '#3A1F00' }}
                />
                <label className="flex items-start gap-2 text-left text-xs font-semibold text-white/90">
                  <input
                    type="checkbox"
                    required
                    checked={groupConsent}
                    onChange={event => setGroupConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#FFE45C]"
                  />
                  <span>I agree to join the Candy Farm closed-testing Google Group with this email.</span>
                </label>
                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="btn-candy w-full rounded-2xl py-3 font-900 text-base transition-transform active:scale-95"
                  style={{
                    fontWeight: 900,
                    background: 'linear-gradient(180deg, #FFE45C 0%, #F2B632 100%)',
                    color: '#7A3F00',
                    boxShadow: '0 6px 0 #C07000, 0 8px 16px rgba(0,0,0,0.2)',
                    border: 'none',
                    letterSpacing: '0.01em',
                  }}
                >
                  {submitState === 'loading' ? '🍬 Saving...' : '🚀 Join the Closed Beta'}
                </button>
                {submitState === 'error' && (
                  <p className="text-white text-xs text-center">{submitError || 'Oops! Try again in a moment.'}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* scroll hint */}
        <div className="mt-6 mb-8 flex flex-col items-center gap-1">
          <p className="text-white/60 text-xs font-600" style={{ fontWeight: 600 }}>Scroll to discover</p>
          <div className="scroll-hint text-white/50 text-lg">↓</div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-14 px-4"
        style={{ background: 'radial-gradient(circle at 15% 15%, rgba(244,185,66,0.14), transparent 22%), linear-gradient(180deg, #173D38 0%, #0C2224 100%)' }}
      >
        {/* section label */}
        <div className="flex justify-center mb-2">
          <span
            className="px-5 py-1.5 rounded-full text-xs font-800 uppercase tracking-widest"
            style={{
              fontWeight: 800,
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              letterSpacing: '0.12em',
            }}
          >
            THE CANDY ARMORY
          </span>
        </div>
        <h2
          className="candy-title text-center text-white text-2xl mb-10 leading-tight"
          style={{
            fontWeight: 900,
            textShadow: '0 3px 10px rgba(0,80,0,0.3)',
          }}
        >
          Pick your weapon.<br /><span className="candy-title-gradient">Protect the farm.</span>
        </h2>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
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
                background: 'rgba(255,255,255,0.95)',
                boxShadow: `0 8px 24px ${shadow}, 0 2px 0 rgba(255,255,255,0.8) inset`,
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

        <div className="armory-glow relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-[#FF5948]/70 bg-[#102B2B]/90 px-5 pb-5 pt-6 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#E34232] via-[#F4B942] to-[#37D5D0]" />
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#F4B942]">Choose your class</p>
              <h3 className="candy-title mt-1 text-2xl uppercase text-white">Loadout ready</h3>
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
        className="py-14 overflow-hidden"
        style={{ background: 'radial-gradient(circle at 80% 12%, rgba(244,185,66,0.2), transparent 18%), linear-gradient(180deg, #291518 0%, #111B27 50%, #082C37 100%)' }}
      >
        <div className="flex justify-center mb-2">
          <span
            className="px-5 py-1.5 rounded-full text-xs font-800 uppercase tracking-widest"
            style={{
              fontWeight: 800,
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              letterSpacing: '0.12em',
            }}
          >
            BATTLE FEED
          </span>
        </div>
        <h2
          className="candy-title text-center text-white text-2xl mb-8 px-4"
          style={{ fontWeight: 900, textShadow: '0 3px 10px rgba(80,0,100,0.4)' }}
        >
          The farm is under fire.
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
                    ? '0 16px 48px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,107,157,0.8)'
                    : '0 8px 24px rgba(0,0,0,0.3)',
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
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-900 hover:bg-white/30 active:scale-90 transition-all"
            style={{ fontWeight: 900 }}
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            {SCREENSHOTS.map((_, i) => <CarouselDot key={i} active={i === carouselIdx} />)}
          </div>
          <button
            onClick={() => scrollCarousel(1)}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-900 hover:bg-white/30 active:scale-90 transition-all"
            style={{ fontWeight: 900 }}
          >
            ›
          </button>
        </div>

        <p className="text-center text-white/50 text-xs mt-3 font-600" style={{ fontWeight: 600 }}>
          Swipe to explore · More levels coming soon
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
                Get early drops, beta intel, loadout tips, and a front-row seat when the next candy island opens. Rally your squad before launch.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-[#F4B942]">
                <span className="border border-[#F4B942]/40 bg-[#F4B942]/10 px-3 py-2">Beta intel</span>
                <span className="border border-[#37D5D0]/40 bg-[#37D5D0]/10 px-3 py-2 text-[#72F2E8]">Squad events</span>
                <span className="border border-[#E34232]/40 bg-[#E34232]/10 px-3 py-2 text-[#FF887D]">Loot drops</span>
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
            <p>© {new Date().getFullYear()} Kora Interactive · Android beta</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
