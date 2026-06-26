
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────────────────────
// PageTransition — Overlapping Parallax (OSMO style)
//
// Click su link interno:
//   1. Clona la pagina corrente (#main-content) → overlay fisso a z:50
//   2. Naviga → React monta la nuova pagina nel wrapper
//   3. Wrapper (nuova pagina) parte da y:100vh e sale a y:0   [z:100]
//   4. Clone (vecchia pagina) ha un parallax: y:0 → y:-15vh   [z:50]
//   5. La nuova pagina scorre sopra la vecchia → effetto overlap
//   6. Clone rimosso al completamento
// ─────────────────────────────────────────────────────────────────────────────

const DURATION = 0.9
const EASE     = 'power3.inOut'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const animating    = useRef(false)

  // ── Scroll top ad ogni cambio rotta ─────────────────────────────────────────
  useEffect(() => {
    const lenis = (window as any).__lenis
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else        window.scrollTo(0, 0)
  }, [pathname])

  // ── Intercettore click ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      if (animating.current) return

      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') ?? ''
      if (!href)                                   return
      if (/^(https?:|mailto:|tel:)/.test(href))    return   // link esterno
      if (href.includes('#'))                      return   // anchor scroll
      if (anchor.target === '_blank')              return
      if (href === pathname)                       return   // stessa pagina

      e.preventDefault()
      animating.current = true

      const { default: gsap } = await import('gsap')

      // ── 1. Cattura visuale della pagina corrente (rispetta lo scroll) ──────
      // Usiamo wrapperRef (il div di PageTransition) come sorgente:
      // non contiene mai il Nav (che è un sibling), evitando che venga
      // clonato e animato durante la transizione.
      const scrollY  = window.scrollY
      const source   = wrapperRef.current ?? document.getElementById('main-content') ?? document.body
      const fullH    = Math.max(source.scrollHeight, document.documentElement.scrollHeight)
      const clone    = source.cloneNode(true) as HTMLElement
      clone.removeAttribute('id')
      Object.assign(clone.style, {
        position      : 'fixed',
        top           : `${-scrollY}px`,   // offset → mostra l'area attualmente visibile
        left          : '0',
        width         : '100%',
        height        : `${fullH}px`,      // altezza intera della pagina
        zIndex        : '50',
        pointerEvents : 'none',
        transformOrigin: 'top center',
      })
      document.body.appendChild(clone)

      // ── 2. Naviga: React monta la nuova rotta dentro wrapperRef ──────────
      navigate(href)

      // ── 3. Scroll to top sincrono prima di impostare le posizioni ───────────
      // Usiamo window.scrollTo nativo (sincrono garantito) + Lenis reset
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      const lenis = (window as any).__lenis
      if (lenis) lenis.scrollTo(0, { immediate: true })

      // ── 4. Setup nuova pagina: position:fixed → sempre relativo al viewport
      //       (evita il bug in cui translateY(100vh) finisce sopra il fold
      //        quando l'utente era scrollato in basso)
      const wrapper = wrapperRef.current
      if (wrapper) {
        wrapper.style.position   = 'fixed'
        wrapper.style.top        = '0'
        wrapper.style.left       = '0'
        wrapper.style.width      = '100%'
        wrapper.style.zIndex     = '100'
        wrapper.style.willChange = 'transform'
        gsap.set(wrapper, { y: '100vh' })
      }

      // ── 5. Overlay scuro tra vecchia e nuova pagina (crea stacco visivo) ───
      const overlay = document.createElement('div')
      Object.assign(overlay.style, {
        position     : 'fixed',
        inset        : '0',
        background   : 'rgba(0,0,0,0.45)',
        zIndex       : '75',
        pointerEvents: 'none',
        opacity      : '0',
      })
      document.body.appendChild(overlay)

      // ── 6. Animazione parallax ────────────────────────────────────────────
      const tl = gsap.timeline({
        onComplete() {
          clone.remove()
          overlay.remove()
          if (wrapper) {
            // Ripristina il flow normale: la nuova pagina diventa scrollabile
            gsap.set(wrapper, { clearProps: 'y,transform' })
            wrapper.style.position   = ''
            wrapper.style.top        = ''
            wrapper.style.left       = ''
            wrapper.style.width      = ''
            wrapper.style.zIndex     = ''
            wrapper.style.willChange = 'auto'
          }
          animating.current = false
          // Segnala che il layout è tornato in flow normale → i componenti
          // che dipendono da posizioni DOM (es. HighlightText) possono
          // ora inizializzarsi con misure corrette.
          window.dispatchEvent(new CustomEvent('pt:complete'))
        },
      })

      // Overlay: fade in rapido → scurisce la vecchia pagina dietro quella nuova
      tl.to(overlay, {
        opacity : 1,
        ease    : 'power2.in',
        duration: DURATION * 0.6,
      }, 0)

      // Vecchia pagina (clone): parallax lento verso l'alto
      tl.to(clone, {
        y       : '-15vh',
        ease    : EASE,
        duration: DURATION,
      }, 0)

      // Nuova pagina: scivola sopra dal basso (fixed → sempre 100vh sotto il fold)
      if (wrapper) {
        tl.to(wrapper, {
          y       : 0,
          ease    : EASE,
          duration: DURATION,
        }, 0)
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname, navigate])

  return (
    <div ref={wrapperRef} style={{ width: '100%', overflowX: 'clip' }}>
      {children}
    </div>
  )
}
