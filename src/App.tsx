import { Routes, Route } from 'react-router-dom'
import Nav from '@/components/shared/Nav'
import SmoothScrollProvider from '@/components/shared/SmoothScrollProvider'
import PageTransition from '@/components/shared/PageTransition'
import CustomCursor from '@/components/shared/CustomCursor'
import HomeClient from '@/app/HomeClient'
import WorkClient from '@/app/work/WorkClient'
import CaseStudyPage from '@/app/work/slug/CaseStudyPage'

function NotFound() {
  return (
    <main style={{ padding: '10rem 4rem', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
      <h1 style={{ fontSize: 'clamp(4rem, 10vw, 10rem)', color: 'var(--ink)', lineHeight: 1 }}>404</h1>
      <p style={{ color: 'var(--faded)', marginTop: '1rem' }}>Pagina non trovata.</p>
    </main>
  )
}

export default function App() {
  return (
    <>
      <CustomCursor />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] px-4 py-2 bg-accent text-white text-[0.75rem] uppercase tracking-widest rounded"
      >
        Salta al contenuto
      </a>
      <Nav />
      <SmoothScrollProvider>
        <PageTransition>
          <Routes>
            <Route
              path="/"
              element={
                <main id="main-content">
                  <HomeClient />
                </main>
              }
            />
            <Route path="/work" element={<WorkClient />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </SmoothScrollProvider>
    </>
  )
}
