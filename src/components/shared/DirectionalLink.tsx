import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { MouseEvent, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// DirectionalLink — cerchio che si espande dal punto esatto di entrata cursore.
//
// Il colore del testo su hover è gestito SOLO da CSS (:hover in globals.css)
// così non può mai rimanere bloccato su un valore inline.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  to             : string
  children       : ReactNode
  wrapClassName ?: string
  linkClassName ?: string
  onClick?       : (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function DirectionalLink({
  to, children, wrapClassName = '', linkClassName = '', onClick,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  const DURATION = 'var(--duration-dir-hover, 0.5s)'
  const EASE     = 'var(--ease-dir-hover, cubic-bezier(0.4, 0, 0.2, 1))'

  const setCircle = (e: MouseEvent<HTMLElement>) => {
    const wrap = wrapRef.current
    const fill = fillRef.current
    if (!wrap || !fill) return

    const rect = wrap.getBoundingClientRect()
    const x    = e.clientX - rect.left
    const y    = e.clientY - rect.top
    const maxR = Math.sqrt(
      Math.max(x, rect.width  - x) ** 2 +
      Math.max(y, rect.height - y) ** 2
    )
    const diam = maxR * 2

    fill.style.width  = `${diam}px`
    fill.style.height = `${diam}px`
    fill.style.left   = `${x - diam / 2}px`
    fill.style.top    = `${y - diam / 2}px`
  }

  const onEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const fill = fillRef.current
    if (!fill) return
    setCircle(e)
    fill.style.transition = 'none'
    fill.style.transform  = 'scale(0)'
    fill.getBoundingClientRect()
    fill.style.transition = `transform ${DURATION} ${EASE}`
    fill.style.transform  = 'scale(1)'
  }

  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const fill = fillRef.current
    if (!fill) return
    setCircle(e)
    fill.style.transition = `transform ${DURATION} ${EASE}`
    fill.style.transform  = 'scale(0)'
  }

  return (
    <div
      ref={wrapRef}
      className={`dir-btn ${wrapClassName}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        ref={fillRef}
        className="dir-btn__fill"
        style={{ transform: 'scale(0)' }}
      />
      <Link
        to={to}
        className={`dir-btn__link ${linkClassName}`}
        onClick={onClick}
      >
        <span className="dir-btn__label">
          {children}
        </span>
      </Link>
    </div>
  )
}
