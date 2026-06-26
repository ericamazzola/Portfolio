

import { useEffect } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// SmoothScrollProvider — monta Lenis una sola volta per tutta l'app.
// Espone l'istanza su window.__lenis così Nav e altri componenti
// possono chiamare lenis.scrollTo() per uno scroll programmatico.
// ─────────────────────────────────────────────────────────────────────────────

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any
    let tickerFn: (t: number) => void

    ;(async () => {
      const { default: gsap }    = await import('gsap')
      const { ScrollTrigger }    = await import('gsap/ScrollTrigger')
      const { default: Lenis }   = await import('lenis')

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration      : 1.1,
        easing        : (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel   : true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      })

      // Rende l'istanza accessibile globalmente per lo scroll programmatico
      ;(window as any).__lenis = lenis

      lenis.on('scroll', ScrollTrigger.update)

      tickerFn = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)

      document.fonts?.ready.then(() => ScrollTrigger.refresh())

      // Resize: ricalcola le posizioni di ScrollTrigger quando cambia la finestra.
      // Debounce 150ms per non sparare ad ogni pixel.
      let resizeTimer: ReturnType<typeof setTimeout>
      const onResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
      }
      window.addEventListener('resize', onResize)
      ;(window as any).__onScrollResize = onResize   // salva ref per cleanup
    })()

    return () => {
      if (tickerFn) {
        import('gsap').then(({ default: gsap }) => gsap.ticker.remove(tickerFn))
      }
      lenis?.destroy()
      ;(window as any).__lenis = null
      const onResize = (window as any).__onScrollResize
      if (onResize) {
        window.removeEventListener('resize', onResize)
        ;(window as any).__onScrollResize = null
      }
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) =>
        ScrollTrigger.getAll().forEach((t: any) => t.kill())
      )
    }
  }, [])

  return <>{children}</>
}
