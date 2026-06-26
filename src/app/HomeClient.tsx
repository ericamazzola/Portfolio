

import { useState, useEffect, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// HomeClient — port fedele di portfolio.html
//
// • Image trail (vanilla DOM) — immagini che seguono il mouse nell'hero
// • HeroText — "2026 / personal portfolio" centrato
// • HighlightText — parole che si illuminano in scroll (GSAP ScrollTrigger)
// • CustomCursor — pallino arancione su sezione #about
// • AboutSection — sfondo blur verde + testi colorati
// • ContactSection — sfondo #112E12, testi cream auto-fit
// • LiveClock — HH:MM:SS AM/PM in tempo reale
// • ScrollHint — SVG mouse animato GSAP
// • ScrollTopBtn — bottone fisso che appare dopo lo scroll
// • Lenis — smooth scroll
// ─────────────────────────────────────────────────────────────────────────────

// Versioni ridotte (400px) dedicate al trail — totale ~476KB invece di ~30MB
const TRAIL_IMAGES = Array.from({ length: 33 }, (_, i) =>
  `/images/trail/t${String(i + 1).padStart(2, '0')}.webp`
)

// Precarica tutte le immagini del trail subito — così al primo movimento del
// mouse sono già in cache e non c'è nessun ritardo di rete
if (typeof window !== 'undefined') {
  TRAIL_IMAGES.forEach(src => { const img = new Image(); img.src = src })
}

const CONTACT_LINES = [
  [{ text: 'erica.mazzola99@gmail.com', href: 'mailto:erica.mazzola99@gmail.com' }],
  [
    { text: 'LinkedIn',       href: 'https://www.linkedin.com/in/erica-mazzola-a591ba19a/' },
    { text: '+39 3348670337', href: 'tel:+393348670337' },
  ],
]

const STATEMENT_SEGMENTS = [
  { parts: [{ text: 'Art director specializing', serif: false }] },
  { parts: [
    { text: 'in', serif: false },
    { text: 'communication, publishing and branding.', serif: true },
  ]},
  { parts: [{ text: 'Based in Bergamo, Italy.', serif: false }] },
]

// ── LiveClock ─────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState<Date | null>(null)
  useEffect(() => {
    setTime(new Date())
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!time) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  const h24 = time.getHours()
  const h12 = ((h24 + 11) % 12) + 1
  const sfx = h24 < 12 ? 'AM' : 'PM'
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {pad(h12)}:{pad(time.getMinutes())}:{pad(time.getSeconds())} {sfx}
    </span>
  )
}

// ── ContactLine (auto-fit font size) ─────────────────────────────────────────
function ContactLine({ items }: { items: { text: string; href: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)

  const fit = useCallback(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentElement?.parentElement
    if (!parent) return
    const s = getComputedStyle(parent)
    const avail = parent.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
    el.style.fontSize = '100px'
    const nat = el.scrollWidth
    if (nat > 0) el.style.fontSize = (100 * avail / nat * 0.88) + 'px'
  }, [])

  useEffect(() => {
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [fit])

  return (
    <div ref={ref} className="contact-line">
      {items.map((item, i) => {
        const ext = /^https?:/.test(item.href)
        return (
          <span key={i}>
            {i > 0 && <span aria-hidden="true" className="contact-line__gap" />}
            <a
              href={item.href}
              target={ext ? '_blank' : undefined}
              rel={ext ? 'noopener noreferrer' : undefined}
              className="contact-line__link"
            >
              {item.text}
            </a>
          </span>
        )
      })}
    </div>
  )
}

// Aspetta che Lenis (asincrono in SmoothScrollProvider) sia pronto.
// Senza questo, ScrollTrigger viene creato prima che Lenis si connetta
// a gsap.ticker e non riceve gli aggiornamenti di scroll.
function waitForLenis(): Promise<void> {
  return new Promise(resolve => {
    if ((window as any).__lenis) { resolve(); return }
    const id = setInterval(() => {
      if ((window as any).__lenis) { clearInterval(id); resolve() }
    }, 20)
  })
}

// ── HighlightText (GSAP ScrollTrigger) ───────────────────────────────────────
function HighlightText() {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return
    let tl: any

    const init = async () => {
      tl?.scrollTrigger?.kill(); tl?.kill(); tl = undefined
      if (!ref.current) return

      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!ref.current) return

      const words = Array.from(ref.current.querySelectorAll('.hl-word'))
      if (!words.length) return

      const section = ref.current.closest('#about') ?? ref.current
      const style     = getComputedStyle(document.documentElement)
      const colorFrom = style.getPropertyValue('--faded-low').trim() || 'rgba(17,46,18,0.18)'
      const colorTo   = style.getPropertyValue('--ink').trim()       || '#112E12'

      tl = gsap.timeline({
        scrollTrigger: {
          trigger            : section,
          start              : 'top 80%',
          end                : 'top top',
          scrub              : 0.6,
          invalidateOnRefresh: true,
        },
      })
      tl.fromTo(words, { color: colorFrom }, {
        color  : colorTo,
        ease   : 'none',
        stagger: { each: 0.4, from: 'start' },
      })

      // Ricalcola dopo che tutti gli elementi sono nel DOM e nel layout corretto
      ScrollTrigger.refresh()
    }

    // Init immediato per il caricamento diretto della pagina
    ;(async () => { await waitForLenis(); init() })()

    // Re-init al termine di ogni page transition (il wrapper torna in flow normale
    // solo nell'onComplete → solo allora le posizioni DOM sono corrette)
    window.addEventListener('pt:complete', init)
    return () => {
      window.removeEventListener('pt:complete', init)
      tl?.scrollTrigger?.kill(); tl?.kill()
    }
  }, [])

  return (
    <p ref={ref} className="hl-text">
      {STATEMENT_SEGMENTS.map((seg, i) => (
        <span key={i} className="hl-text__line">
          {seg.parts.map((part, pi) => (
            <span key={pi}>
              {pi > 0 && ' '}
              {part.text.split(' ').map((w, wi, arr) => (
                <span key={wi}>
                  <span className={`hl-word ${part.serif ? 'hl-word--serif' : ''}`}>{w}</span>
                  {wi < arr.length - 1 && ' '}
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </p>
  )
}

// ── ScrollHint ────────────────────────────────────────────────────────────────
function ScrollHint() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    let tween: any
    ;(async () => {
      await waitForLenis()
      if (!wrapRef.current) return
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      tween = gsap.to(wrapRef.current, {
        opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start  : 'top top',
          end    : () => `+=${window.innerHeight * 0.4}`,
          scrub  : true,
        },
      })
    })()
    return () => { tween?.scrollTrigger?.kill(); tween?.kill() }
  }, [])

  return (
    <>
      <div ref={wrapRef} className="scroll-hint">Scroll down</div>
    </>
  )
}

// ── ScrollTopBtn ──────────────────────────────────────────────────────────────
function ScrollTopBtn() {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!btnRef.current) return
    let tween: any
    ;(async () => {
      await waitForLenis()
      if (!btnRef.current) return
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.set(btnRef.current, { autoAlpha: 0, y: 12 })
      tween = gsap.to(btnRef.current, {
        autoAlpha    : 1, y: 0,
        duration     : 0.3, ease: 'power2.out',
        scrollTrigger: {
          trigger      : document.body,
          start        : () => `+=${window.innerHeight * 0.6}`,
          end          : 'max',
          toggleActions: 'play none none reverse',
        },
      })
    })()
    return () => { tween?.scrollTrigger?.kill(); tween?.kill() }
  }, [])

  return (
    <button
      ref={btnRef}
      className="btn-scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Torna su"
    >↑</button>
  )
}


// ── HomeClient (root) ─────────────────────────────────────────────────────────
export default function HomeClient() {

  // Pulisce le vars inline impostate dalla work page (--canvas, --ink),
  // senza toccare il tema dark/light (rispetta la preferenza salvata).
  useEffect(() => {
    const root = document.documentElement
    root.style.removeProperty('--canvas')
    root.style.removeProperty('--ink')
  }, [])

  // Image trail — spawn immagini al mouse nell'hero
  useEffect(() => {
    let idx = 0, lastX: number | null = null, lastY: number | null = null
    const cardPx   = window.innerWidth * 0.11
    const stepDist = cardPx * 0.45

    const spawn = (x: number, y: number) => {
      const el  = document.createElement('div')
      const img = document.createElement('img')
      img.src   = TRAIL_IMAGES[idx]
      img.draggable = false
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;'
      el.appendChild(img)
      el.style.cssText = `
        position:fixed;left:${x}px;top:${y}px;
        width:var(--trail-card-w,11vw);aspect-ratio:3/4;
        z-index:20;pointer-events:none;user-select:none;overflow:hidden;
        transform:translate(-50%,-50%) scale(0) rotate(-20deg);
      `
      document.body.appendChild(el)
      void el.getBoundingClientRect()
      el.style.transition = 'transform 0.4s cubic-bezier(0.625,0.05,0,1)'
      el.style.transform  = 'translate(-50%,-50%) scale(1) rotate(0.001deg)'
      setTimeout(() => {
        el.style.transition = 'transform 0.8s cubic-bezier(0.625,0,0.875,0)'
        el.style.transform  = 'translate(-50%,-50%) scale(0) rotate(180deg)'
      }, 500)
      setTimeout(() => el.remove(), 1400)
      idx = (idx + 1) % TRAIL_IMAGES.length
      lastX = x; lastY = y
    }

    const heroH = window.innerHeight // hero è esattamente 100vh

    const onMove = (e: MouseEvent) => {
      // Posizione documento = clientY + scrollY; hero finisce a heroH
      if (e.clientY + window.scrollY > heroH) { lastX = lastY = null; return }
      const { clientX: x, clientY: y } = e
      if (lastX === null || lastY === null) { spawn(x, y); return }
      if (Math.hypot(x - lastX, y - lastY) >= stepDist) spawn(x, y)
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // GSAP ScrollTrigger init (Lenis è gestito globalmente da SmoothScrollProvider)
  useEffect(() => {
    ;(async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    })()
  }, [])

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <div id="hero" className="hero">
        <div className="hero__text">
          <h1 className="hero__title">
            <span className="hero__title-row">2026</span>
            <span className="hero__title-row">
              personal{' '}
              <span className="hero__title-serif">portfolio</span>
            </span>
          </h1>
        </div>
        <ScrollHint />
      </div>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section id="about" className="about">

        {/* Blocco 1: blob verde + HighlightText */}
        <div className="about__blob">
          <div className="about__blob-bg" aria-hidden="true" />
          <div className="about__blob-content">
            <HighlightText />
          </div>
        </div>

        {/* Blocco 2: contact */}
        <div id="contact" className="contact">
          <div className="contact__links">
            {CONTACT_LINES.map((items, i) => (
              <ContactLine key={i} items={items} />
            ))}
          </div>
          <div className="contact__footer">
            <span className="contact__meta"><LiveClock /></span>
            <p className="contact__meta">©EricaMazzola2026</p>
          </div>
        </div>

      </section>

      <ScrollTopBtn />
    </>
  )
}
