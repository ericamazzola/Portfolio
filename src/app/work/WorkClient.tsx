
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────────────────────
// WorkClient
//
// Hover completamente DOM-diretto — zero setHovered, zero re-render su hover.
// Solo `dark` rimane in React state (serve per aggiornare CSS vars e body).
// ─────────────────────────────────────────────────────────────────────────────

const PROJECTS = [
  { id: 1, slug: 'aurabloom',               title: 'AuraBloom',               cat: 'Brand Identity',             img1: '/images/thumbs/aurabloom.webp' },
  { id: 2, slug: 'fondazione-tearte-lecco', title: 'Fondazione Tèarte Lecco',  cat: 'Brand Identity · Editorial', img1: '/images/thumbs/fondazione-tearte-lecco.webp' },
  { id: 3, slug: 'bolognafirenze2036',      title: 'AI Experiments',           cat: 'Campaign · Visual Identity', img1: '/images/thumbs/bolognafirenze2036.webp' },
  { id: 4, slug: 'bergamoscienza',          title: 'BergamoScienza',           cat: 'Art Direction',              img1: '/images/thumbs/bergamoscienza.webp' },
  { id: 5, slug: 'menelique',               title: 'Menelique',                cat: 'Visual Identity',            img1: '/images/thumbs/menelique.webp' },
] as const

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export default function WorkClient() {
  // ── Unico stato React: tema ───────────────────────────────────────────────
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark' } catch { }
    return document.body.classList.contains('dark')
  })

  // ── Refs DOM ──────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const followerRef  = useRef<HTMLDivElement>(null)
  const imgRef       = useRef<HTMLImageElement>(null)
  const catRef       = useRef<HTMLParagraphElement>(null)
  const mouseRef     = useRef({ x: 0, y: 0 })
  const posRef       = useRef({ x: 0, y: 0 })

  // ── Hover state (ref, non React state) ───────────────────────────────────
  const hoveredRef     = useRef<number | null>(null)
  const animCancelsRef = useRef(new Map<number, () => void>())

  // ── Preload immagini al mount ─────────────────────────────────────────────
  useEffect(() => {
    PROJECTS.forEach(p => { const i = new Image(); i.src = p.img1 })
  }, [])

  // ── Aggiorna UI hover via DOM diretto (zero re-render) ───────────────────
  const setHoverState = (id: number | null) => {
    // cursore: visibilità + src
    if (followerRef.current)
      followerRef.current.classList.toggle('work__cursor--visible', id !== null)
    if (imgRef.current && id !== null) {
      const p = PROJECTS.find(p => p.id === id)
      if (p) imgRef.current.src = p.img1
    }

    // link: data-active
    containerRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.setAttribute('data-active', 'false')
    if (id !== null)
      containerRef.current
        ?.querySelector<HTMLElement>(`[data-pid="${id}"]`)
        ?.setAttribute('data-active', 'true')

    // categoria
    if (catRef.current) {
      const p = id !== null ? PROJECTS.find(p => p.id === id) : null
      catRef.current.textContent      = p?.cat ?? ''
      catRef.current.style.opacity    = p ? '0.6' : '0'
      catRef.current.style.transform  = p ? 'translateY(0)' : 'translateY(5px)'
    }
  }

  // ── Scramble: RAF loop, zero setTimeout ──────────────────────────────────
  const scramble = (id: number, forward: boolean) => {
    animCancelsRef.current.get(id)?.()

    const link  = containerRef.current?.querySelector<HTMLElement>(`[data-pid="${id}"]`)
    const spans = Array.from(link?.querySelectorAll('span') ?? []) as HTMLElement[]
    if (!spans.length) return

    const origChars = spans.map(s => s.textContent ?? '')

    let cancelled = false
    animCancelsRef.current.set(id, () => {
      cancelled = true
      spans.forEach((s, i) => { s.textContent = origChars[i] })
    })

    const duration  = 380
    const start     = performance.now()
    const resolveAt = spans.map(() => Math.random() * duration)

    const tick = (now: number) => {
      if (cancelled) return
      const elapsed = now - start
      let pending = false

      spans.forEach((span, i) => {
        if (resolveAt[i] < 0) return
        if (elapsed >= resolveAt[i]) {
          span.textContent      = origChars[i]
          span.style.fontFamily = forward ? 'var(--font-serif)' : ''
          span.style.fontStyle  = forward ? 'italic'            : ''
          resolveAt[i] = -1
        } else {
          if (Math.random() < 0.08) {
            if (origChars[i] !== ' ')
              span.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            const show = Math.random() > 0.5
            span.style.fontFamily = show ? 'var(--font-serif)' : ''
            span.style.fontStyle  = show ? 'italic'            : ''
          }
          pending = true
        }
      })

      if (pending) requestAnimationFrame(tick)
      else animCancelsRef.current.delete(id)
    }

    requestAnimationFrame(tick)
  }

  const startHover = (id: number) => {
    const prevId = hoveredRef.current
    hoveredRef.current = id
    setHoverState(id)
    if (prevId !== null && prevId !== id) scramble(prevId, false)
    scramble(id, true)
  }

  const stopHover = () => {
    const id = hoveredRef.current
    hoveredRef.current = null
    setHoverState(null)
    if (id !== null) scramble(id, false)
  }

  // ── RAF lerp cursore ─────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number
    const IMG_W = 320, IMG_H = 427

    const animate = () => {
      const mouse = mouseRef.current
      const pos   = posRef.current
      pos.x += (mouse.x - pos.x) * 0.12
      pos.y += (mouse.y - pos.y) * 0.12

      if (followerRef.current && containerRef.current) {
        const areaW = containerRef.current.offsetWidth
        const areaH = containerRef.current.offsetHeight
        followerRef.current.style.left = `${Math.max(8, Math.min(pos.x - IMG_W / 2, areaW - IMG_W - 8))}px`
        followerRef.current.style.top  = `${Math.max(8, Math.min(pos.y - IMG_H / 2, areaH - IMG_H - 8))}px`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // ── Tema ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = dark ? '#112E12' : '#EFF1C7'
    const ink    = dark ? '#EFF1C7' : '#112E12'
    const root   = document.documentElement
    root.style.setProperty('--canvas', canvas)
    root.style.setProperty('--ink',    ink)
    document.body.style.background = canvas
    document.body.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    setDark(document.body.classList.contains('dark'))
    const observer = new MutationObserver(() =>
      setDark(document.body.classList.contains('dark'))
    )
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      const root = document.documentElement
      root.style.removeProperty('--canvas')
      root.style.removeProperty('--ink')
      document.body.style.removeProperty('background')
    }
  }, [])

  // ── Pulizia animazioni all'unmount ────────────────────────────────────────
  useEffect(() => () => { animCancelsRef.current.forEach(c => c()) }, [])

  const canvas = dark ? '#112E12' : '#EFF1C7'

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="work"
      style={{ background: canvas }}
      onMouseMove={e => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          mouseRef.current.x = e.clientX - rect.left
          mouseRef.current.y = e.clientY - rect.top
        }
      }}
      onMouseLeave={stopHover}
    >
      {/* ── Cursor follower ────────────────────────────────────── */}
      <div ref={followerRef} aria-hidden="true" className="work__cursor">
        <img
          ref={imgRef}
          src=""
          alt=""
          style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* ── Lista progetti centrata ────────────────────────────── */}
      <div className="work__center">
        <nav aria-label="Progetti">
          <ul className="work__list" onMouseLeave={stopHover}>
            {PROJECTS.map(p => (
              <li key={p.id} onMouseEnter={() => startHover(p.id)}>
                <Link
                  to={`/work/${p.slug}`}
                  className="work__item"
                  data-active="false"
                  data-pid={p.id}
                >
                  {[...p.title].map((char, i) => (
                    <span key={i}>{char}</span>
                  ))}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p
          ref={catRef}
          aria-live="polite"
          className="work__cat"
          style={{ opacity: 0, transform: 'translateY(5px)' }}
        />
      </div>
    </div>
  )
}
