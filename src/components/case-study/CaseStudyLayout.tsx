

import { useEffect, useRef, useState } from 'react'
import type { CaseStudy } from '@/lib/types/case-study'

// ─────────────────────────────────────────────────────────────────────────────
// CaseStudyLayout — pagine singolo progetto
//
// Layout:
//   1. Header — tag pill arancio (anno · servizio · categoria)
//              + marquee orizzontale con nome che scorre (Manrope / Serif italic)
//   2. Banda verde #112E12 — immagine 16:7 full-bleed (gridImages[6])
//   3. Gallery 3×2 — aspect-ratio 4/5, gap 24px, padding 24px
//
// Sfondo default: #EFF1C7 (var(--canvas)) — toggle dark/light via Nav pallino
// Cursore: pallino arancio con lerp
// Responsive: 3 col → 2 col (≤768px) → 1 col (≤480px)
// ─────────────────────────────────────────────────────────────────────────────


// ── Bottone scroll-to-top ─────────────────────────────────────────────────────
function ScrollTopBtn() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      aria-label="Torna su"
      title="Torna su"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position  : 'fixed',
        bottom    : '2rem',
        right     : '2.5rem',
        zIndex    : 60,
        width     : '48px',
        height    : '48px',
        border    : 'none',
        borderRadius: '50%',
        background: 'var(--accent)',
        color     : 'var(--ink-dark)',
        cursor    : 'pointer',
        display   : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize  : '1.25rem',
        lineHeight: 1,
        opacity   : visible ? 1 : 0,
        transform : visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      ↑
    </button>
  )
}

// ── Marquee con nome alternato Manrope / Serif italic ────────────────────────
function TitleMarquee({ title, color }: { title: string; color: string }) {
  // Una "unità" = [Manrope]Title[/Manrope] * [Serif]Title[/Serif] *
  // Duplichiamo per loop seamless
  const REPS = 4

  const unit = (
    <>
      <span style={{
        fontFamily   : 'var(--font-display)',
        fontWeight   : 400,
        fontStyle    : 'normal',
        whiteSpace   : 'nowrap',
      }}>{title}</span>
      <span style={{
        display     : 'inline-block',
        padding     : '0 0.55em',
        lineHeight  : 1,
        verticalAlign: 'middle',
        fontFamily  : 'var(--font-display)',
        fontWeight  : 400,
      }}>*</span>
      <span style={{
        fontFamily   : "'Instrument Serif', serif",
        fontWeight   : 400,
        fontStyle    : 'italic',
        whiteSpace   : 'nowrap',
      }}>{title}</span>
      <span style={{
        display     : 'inline-block',
        padding     : '0 0.55em',
        lineHeight  : 1,
        verticalAlign: 'middle',
        fontFamily  : 'var(--font-display)',
        fontWeight  : 400,
      }}>*</span>
    </>
  )

  // Genera un array di REPS*2 unità (REPS = set A, REPS = set B per -50% seamless)
  const totalReps = REPS * 2

  return (
    <div
      aria-label={title}
      style={{
        overflow     : 'hidden',
        padding      : 'clamp(1rem, 2vw, 1.75rem) 0',
      }}
    >
      <div
        className="cs-marquee-track"
        style={{
          display    : 'inline-flex',
          alignItems : 'center',
          fontSize   : 'clamp(44px, 7vw, 120px)',
          lineHeight : 1.04,
          letterSpacing: '-0.02em',
          color      : color,
          willChange : 'transform',
        }}
      >
        {Array.from({ length: totalReps }).map((_, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {unit}
          </span>
        ))}
      </div>
    </div>
  )
}

interface Props {
  data: CaseStudy
}

export default function CaseStudyLayout({ data }: Props) {
  const { hero, gridImages } = data
  const pageRef      = useRef<HTMLDivElement>(null)
  const imgCursorRef = useRef<HTMLDivElement>(null)
  const headerRef    = useRef<HTMLDivElement>(null)

  const cursorMaxHeight = data.theme?.headerCursorMaxHeight ?? 400
  // headerCursor attivo di default su tutte le pagine, disabilitabile con headerCursor: false
  const hasHeaderCursor = !!(data.theme?.headerCursor !== false && gridImages[6])

  // Touch detection (mobile: no mouse follow, immagine statica centrata)
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches

  // Target lerp accessibile dal JSX (onMouseLeave) senza re-render
  const targetRef = useRef({ x: 0, y: 0 })

  // ── Dark/light mode ───────────────────────────────────────────────────────
  // Le pagine case study partono sempre in dark mode. L'utente può fare toggle.
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const wasDark = document.body.classList.contains('dark')
    document.body.classList.add('dark')
    setIsDarkMode(true)

    const sync = () => setIsDarkMode(document.body.classList.contains('dark'))
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
      if (!wasDark) document.body.classList.remove('dark')
    }
  }, [])

  // Colori del tema: dark → colori del progetto, light → token globali
  const bg        = isDarkMode ? (data.theme?.bg        ?? '#000000') : '#EFF1C7'
  const textColor = isDarkMode ? (data.theme?.text       ?? '#EFF1C7') : '#112E12'
  const titleColor = isDarkMode ? (data.theme?.titleColor ?? '#EFF1C7') : '#112E12'
  const logoColor = isDarkMode ? (data.theme?.logoColor  ?? '#EFF1C7') : '#112E12'
  const headerBg  = isDarkMode ? (data.theme?.headerBg   ?? '#112E12') : '#EFF1C7'

  // Passa logoColor al body così la Nav lo può leggere
  useEffect(() => {
    document.body.setAttribute('data-logo-color', logoColor)
    return () => document.body.removeAttribute('data-logo-color')
  }, [logoColor])

  // ── IntersectionObserver reveal ──────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.cs-reveal').forEach(el => el.classList.add('cs-in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('cs-in'); observer.unobserve(target) }
      }),
      { threshold: 0.06, rootMargin: '-30px 0px' }
    )
    const els = pageRef.current?.querySelectorAll('.cs-reveal') ?? []
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // ── Lerp cursore-immagine dentro l'header (solo desktop con mouse) ──────────
  useEffect(() => {
    if (!hasHeaderCursor || isTouch) return

    // Coordinate relative all'header — scroll-proof
    const header = headerRef.current!
    const initW  = header.offsetWidth
    const initH  = header.offsetHeight

    // Target e posizione corrente in coordinate header-relative
    targetRef.current = { x: initW / 2, y: initH / 2 }
    let dx = initW / 2, dy = initH / 2, raf: number
    let isInHeader = false

    const resetToCenter = () => {
      targetRef.current.x = header.offsetWidth  / 2
      targetRef.current.y = header.offsetHeight / 2
    }

    const onMove = (e: MouseEvent) => {
      if (!isInHeader) return
      const rect = header.getBoundingClientRect()
      targetRef.current.x = e.clientX - rect.left
      targetRef.current.y = e.clientY - rect.top
    }

    const onEnter = () => { isInHeader = true }
    const onLeave = () => { isInHeader = false; resetToCenter() }

    const tick = () => {
      dx += (targetRef.current.x - dx) * 0.07
      dy += (targetRef.current.y - dy) * 0.07

      if (imgCursorRef.current) {
        const w = imgCursorRef.current.offsetWidth
        const h = imgCursorRef.current.offsetHeight
        imgCursorRef.current.style.left = `${dx - w / 2}px`
        imgCursorRef.current.style.top  = `${dy - h / 2}px`
      }
      raf = requestAnimationFrame(tick)
    }

    header.addEventListener('mouseenter', onEnter)
    header.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousemove',  onMove)
    tick()
    return () => {
      header.removeEventListener('mouseenter', onEnter)
      header.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousemove',  onMove)
      cancelAnimationFrame(raf)
    }
  }, [hasHeaderCursor, isTouch])

  const tags = [hero.year, hero.service, hero.category].filter(Boolean)

  return (
    <>

      <ScrollTopBtn />

      <style>{`
        /* ── Reveal ── */
        .cs-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .75s ease, transform .75s ease;
        }
        .cs-reveal.cs-in {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-reveal { opacity: 1 !important; transform: none !important; }
        }

        /* ── Marquee titolo ── */
        @keyframes cs-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .cs-marquee-track {
          animation: cs-marquee 28s linear infinite;
        }

        /* ── Marquee tag ── */
        @keyframes cs-tag-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .cs-tag-marquee {
          animation: cs-tag-marquee 12s linear infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-marquee-track, .cs-tag-marquee { animation: none; }
        }

        /* ── Gallery grid ── */
        .cs-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding: 24px;
        }
        @media (max-width: 768px) {
          .cs-gallery { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .cs-gallery { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        ref={pageRef}
        style={{
          background  : bg,
          color       : textColor,
          minHeight   : '100vh',
          cursor      : isTouch ? 'auto' : 'none',
          overflowX   : 'clip',
          maxWidth    : '100%',
        }}
      >

        {/* ── 1. IMMAGINE HEADER + TITOLO + CREDIT OVERLAY ────────────────── */}
        {gridImages[6] && (
          <div
            ref={headerRef}
            className="cs-reveal"
            style={{ position: 'relative', background: headerBg, overflow: 'hidden', cursor: hasHeaderCursor ? 'none' : undefined }}
          >
            {!hasHeaderCursor && (
              
              <img
                src={gridImages[6].src}
                alt={gridImages[6].alt}
                loading="lazy"
                style={{
                  width      : '100%',
                  aspectRatio: '16 / 7',
                  objectFit  : 'cover',
                  display    : 'block',
                  opacity    : 0.88,
                  transition : 'transform .8s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            )}
            {/* MOBILE: immagine statica centrata, altezza full-screen */}
            {hasHeaderCursor && isTouch && (
              <div style={{
                width          : '100%',
                height         : '100vh',
                display        : 'flex',
                alignItems     : 'center',
                justifyContent : 'center',
                pointerEvents  : 'none',
                position       : 'relative',
                zIndex         : 2,
              }}>
                <img
                  src={gridImages[6].src}
                  alt=""
                  aria-hidden="true"
                  style={{
                    height    : '70vh',
                    maxHeight : `${cursorMaxHeight}px`,
                    width     : 'auto',
                    objectFit : 'cover',
                    display   : 'block',
                  }}
                />
              </div>
            )}

            {/* DESKTOP: altezza fissa + immagine che segue il cursore */}
            {hasHeaderCursor && !isTouch && (
              <div style={{ width: '100%', aspectRatio: '16 / 7' }} />
            )}
            {hasHeaderCursor && !isTouch && (
              <div
                ref={imgCursorRef}
                aria-hidden="true"
                style={{
                  position     : 'absolute',
                  top          : 0,
                  left         : 0,
                  pointerEvents: 'none',
                  zIndex       : 2,
                }}
              >
                <div
                  style={{
                    height    : '70vh',
                    maxHeight : `${cursorMaxHeight}px`,
                    width     : 'auto',
                    overflow  : 'hidden',
                    opacity   : 1,
                  }}
                >
                  <img
                    src={gridImages[6].src}
                    alt=""
                    style={{ height: '100%', width: 'auto', display: 'block', objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}

            {/* Titolo + credit sovrapposti, centrati verticalmente */}
            <div style={{
              position      : 'absolute',
              inset         : 0,
              display       : 'flex',
              flexDirection : 'column',
              alignItems    : 'center',
              justifyContent: 'center',
              overflow      : 'hidden',
              gap           : '0.75rem',
              zIndex        : 10,
            }}>
              <div style={{ width: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
                <TitleMarquee title={hero.title} color={titleColor} />
              </div>

              {data.credit && (() => {
                const creditStyle = {
                  fontFamily   : 'var(--font-body)',
                  fontSize     : '0.75rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const,
                  color        : 'var(--ink-dark)',
                  textDecoration: 'none',
                  zIndex       : 2,
                }
                return data.credit.href ? (
                  <a
                    href={data.credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...creditStyle, transition: `color var(--duration-link) ease` }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-dark)')}
                  >
                    {data.credit.name}
                  </a>
                ) : (
                  <span style={creditStyle}>{data.credit.name}</span>
                )
              })()}
            </div>
          </div>
        )}

        {/* ── Striscia arancio divisorio ────────────────────────────────────── */}
        <div
          style={{
            width     : '100%',
            background: 'var(--accent)',
            overflow  : 'hidden',
            padding   : '0.6rem 0',
          }}
        >
          <div
            className="cs-tag-marquee"
            style={{
              display      : 'inline-flex',
              alignItems   : 'center',
              whiteSpace   : 'nowrap',
              color        : '#fff',
              fontSize     : '.75rem',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              fontFamily   : 'var(--font-body)',
              lineHeight   : 1.4,
              willChange   : 'transform',
            }}
          >
            {/* Duplicato ×2 per loop seamless a -50% */}
            {Array.from({ length: 2 }).map((_, gi) => (
              <span key={gi} aria-hidden={gi > 0 ? true : undefined}
                style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {tags.map((tag, ti) => (
                      <span key={ti} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span>{tag}</span>
                        {ti < tags.length - 1 && <span style={{ padding: '0 1em' }}>/</span>}
                      </span>
                    ))}
                    <span style={{ padding: '0 2em' }}>·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── 3. GALLERY 3×2 ────────────────────────────────────────────────── */}
        <section aria-label="Immagini del progetto" className="cs-gallery">
          {gridImages.slice(0, 6).map((img, i) => {
            const isVideo = img.src.endsWith('.mp4') || img.src.endsWith('.webm')
            const hasHover = !!img.hoverSrc
            return (
              <div
                key={i}
                className="cs-reveal"
                style={{ overflow: 'hidden', position: 'relative' }}
              >
                {isVideo ? (
                  <video
                    src={img.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width      : '100%',
                      aspectRatio: '4 / 5',
                      objectFit  : 'cover',
                      display    : 'block',
                      transition : 'transform .65s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ) : (
                  <>
                    
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      style={{
                        width      : '100%',
                        aspectRatio: '4 / 5',
                        objectFit  : 'cover',
                        display    : 'block',
                        transition : 'transform .65s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {hasHover && (
                      <img
                        src={img.hoverSrc}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        style={{
                          position   : 'absolute',
                          inset      : 0,
                          width      : '100%',
                          height     : '100%',
                          objectFit  : 'cover',
                          display    : 'block',
                          opacity    : 0,
                          transition : 'opacity .38s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '0' }}
                      />
                    )}
                  </>
                )}
              </div>
            )
          })}
        </section>

      </div>
    </>
  )
}
