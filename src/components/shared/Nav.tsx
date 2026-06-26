
import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import DirectionalLink from './DirectionalLink'

// ─────────────────────────────────────────────────────────────────────────────
// Nav — fixed, transparent.
// Colori e layout da CSS classes (globals.css).
// Inline styles usati solo per --nav-logo-color (dinamico da CaseStudyLayout).
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Work',    href: '/work'      },
  { label: 'About',   href: '/#about'    },
  { label: 'Contact', href: '/#contact'  },
]

export default function Nav() {
  const [dark, setDark]           = useState(false)
  const [logoColor, setLogoColor] = useState<string | null>(null)
  const { pathname }              = useLocation()
  const navigate                  = useNavigate()
  const isProjectPage             = /^\/work\/.+/.test(pathname ?? '')

  // Smooth scroll verso anchor (usa Lenis se disponibile)
  const scrollToAnchor = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const lenis = (window as any).__lenis
    lenis ? lenis.scrollTo(target, { offset: 0 }) : target.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHashLink = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('/#')) return
    e.preventDefault()
    const id = href.slice(2)
    if (pathname === '/') {
      scrollToAnchor(id)
    } else {
      navigate('/')
      const tryScroll = (attempts = 0) => {
        const target = document.getElementById(id)
        const lenis  = (window as any).__lenis
        if (target && lenis) {
          setTimeout(() => scrollToAnchor(id), 80)
        } else if (attempts < 50) {
          setTimeout(() => tryScroll(attempts + 1), 100)
        }
      }
      setTimeout(() => tryScroll(), 200)
    }
  }

  // Legge il colore logo impostato da CaseStudyLayout via data-attr
  useEffect(() => {
    const read = () => setLogoColor(document.body.getAttribute('data-logo-color'))
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-logo-color'] })
    return () => obs.disconnect()
  }, [])

  // Sync dark mode
  useEffect(() => {
    const sync = () => setDark(document.body.classList.contains('dark'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const [spinning, setSpinning] = useState(false)
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggle = () => {
    if (spinning) return
    setSpinning(true)
    // Swappa il tema a metà rotazione (180°) per un cambio icona seamless
    spinTimer.current = setTimeout(() => {
      const next = !dark
      document.body.classList.toggle('dark', next)
      setDark(next)
      try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch(e) {}
    }, 200)
    setTimeout(() => setSpinning(false), 420)
  }

  // Classe variante pillola
  const pillWrapClass = `nav-pill-btn${isProjectPage ? ' nav-pill-btn--project' : ''}`

  return (
    <nav
      id="site-nav"
      className={isProjectPage ? 'is-project' : ''}
      // --nav-logo-color: colore logo personalizzato per case study (unico inline style necessario)
      style={isProjectPage && logoColor ? { '--nav-logo-color': logoColor } as React.CSSProperties : undefined}
    >
      {/* Logo — visibile solo su desktop */}
      <div className="nav-logo">
        <Link to="/">Erica Mazzola</Link>
      </div>

      {/* Bottone EM — visibile solo su mobile */}
      <div className="nav-em-wrap">
        <Link to="/" className="nav-em-btn">EM</Link>
      </div>

      {/* Pills + toggle */}
      <div className="nav-links">
        <ul className="nav-pills">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <DirectionalLink
                to={href}
                wrapClassName={pillWrapClass}
                linkClassName="nav-pill"
                onClick={href.startsWith('/#') ? (e) => handleHashLink(e, href) : undefined}
              >
                {label}
              </DirectionalLink>
            </li>
          ))}
        </ul>

        {/* Dark/light toggle — visibile su tutte le pagine */}
        <button
          className={`nav-toggle${spinning ? ' nav-toggle--spin' : ''}`}
          onClick={toggle}
          title={dark ? 'Passa a chiaro' : 'Passa a scuro'}
          aria-label={dark ? 'Passa a chiaro' : 'Passa a scuro'}
          data-cursor-expand
        >
          {dark ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
        </button>
      </div>
    </nav>
  )
}
