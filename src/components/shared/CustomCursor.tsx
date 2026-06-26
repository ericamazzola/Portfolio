import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

// Cursore pallino arancione — globale per tutta l'app.
// Usa un portal verso document.body così non viene bloccato da
// nessun containing block (willChange/transform) dei componenti figli.
// Scala su hover su elementi interattivi.

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Su dispositivi touch non montare il cursore (controllo multiplo per compatibilità browser)
    const isTouch =
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0
    if (isTouch) return
    setMounted(true)

    // Forza cursor:none via <style> iniettato a runtime (dopo tutti i fogli di stile).
    // Chrome ignora cursor:none su * in alcuni casi anche con !important;
    // un tag <style> aggiunto last-in-cascade è più affidabile.
    const styleTag = document.createElement('style')
    styleTag.textContent = [
      ':root,html,body{cursor:none!important}',
      '*,*::before,*::after{cursor:none!important}',
      'a,button,label,select,input,textarea,summary,[role="button"],[tabindex]{cursor:none!important}',
    ].join('')
    document.head.appendChild(styleTag)
    // Anche inline su <html> come ultima barriera
    document.documentElement.style.setProperty('cursor', 'none', 'important')

    let mx = 0, my = 0, dx = 0, dy = 0, scale = 1, raf: number
    let mode: 'normal' | 'hide' | 'scale' | 'expand' = 'normal'
    let expandEl: HTMLElement | null = null

    // .nav-pill (i 3 bottoni menu) → nasconde il cursore
    const HIDE_SEL   = '.nav-pill, [data-cursor-hide]'
    // tutti gli altri link/bottoni → ingrandisce il cursore
    const SCALE_SEL  = 'a, button, [role="button"], label, select, summary'
    // [data-cursor-expand] → espande il cursore a coprire l'elemento
    const EXPAND_SEL = '[data-cursor-expand]'

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dotRef.current) dotRef.current.style.opacity = '1'
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element
      if (el.closest(EXPAND_SEL)) {
        mode     = 'expand'
        expandEl = el.closest(EXPAND_SEL) as HTMLElement
      } else if (el.closest(HIDE_SEL)) {
        mode     = 'hide'
        expandEl = null
      } else if (el.closest(SCALE_SEL)) {
        mode     = 'scale'
        expandEl = null
      } else {
        mode     = 'normal'
        expandEl = null
      }
    }

    const tick = () => {
      let targetX     = mx
      let targetY     = my
      let targetScale = 1

      if (mode === 'hide') {
        targetScale = 0
      } else if (mode === 'scale') {
        targetScale = 2.2
      } else if (mode === 'expand' && expandEl) {
        // Leggi il rect ad ogni frame (gestisce scroll e resize)
        const rect = expandEl.getBoundingClientRect()
        targetX     = rect.left + rect.width  / 2
        targetY     = rect.top  + rect.height / 2
        // Scala il dot (22px base) per coprire esattamente il bottone
        targetScale = Math.max(rect.width, rect.height) / 22
      }

      dx    += (targetX     - dx)    * 0.28
      dy    += (targetY     - dy)    * 0.28
      scale += (targetScale - scale) * 0.18

      if (dotRef.current) {
        // r è sempre 11 (metà del div base 22px) — scale() cresce dal centro,
        // quindi il cerchio rimane centrato su (dx, dy) a qualsiasi dimensione.
        dotRef.current.style.transform = `translate3d(${dx - 11}px,${dy - 11}px,0) scale(${scale})`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    tick()
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
      styleTag.remove()
      document.documentElement.style.removeProperty('cursor')
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position     : 'fixed',
        top          : 0,
        left         : 0,
        width        : '22px',
        height       : '22px',
        borderRadius : '50%',
        background   : 'var(--accent)',
        pointerEvents: 'none',
        zIndex       : 9999,
        opacity      : 0,
        transform    : 'translate3d(-9999px,-9999px,0)',
        transition   : 'opacity 0.2s ease',
      }}
    />,
    document.body,
  )
}
