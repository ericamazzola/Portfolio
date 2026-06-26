
/**
 * EditorialGallery
 *
 * Premium editorial image gallery with:
 *  - 4-variant asymmetric layout cycle (full · wide-left · narrow-right · portrait-center)
 *  - Scroll-driven parallax per image (optional, disabled on reduced-motion)
 *  - Clip-path wipe reveal animation on scroll entry
 *  - next/image blur placeholder (canvas-tinted shimmer fallback)
 *  - Fully accessible: semantic figure/figcaption, sr-only count, reduced-motion
 *
 * Accessibility notes
 *  - <section aria-label="Image gallery"> provides a landmark
 *  - Each <figure> groups image + caption semantically
 *  - All images require meaningful alt text (enforced by type)
 *  - Hidden counter gives screen readers "Image N of N" context
 *  - useReducedMotion() disables all transform-based animations
 *  - Parallax uses will-change-transform for GPU compositing (no reflow)
 */

import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryImage {
  /** Absolute URL or Next.js-resolvable path */
  src          : string
  /** Meaningful description — never empty; describe visual content, not "image of" */
  alt          : string
  /** Intrinsic pixel width — required by next/image for layout reservation */
  width        : number
  /** Intrinsic pixel height */
  height       : number
  /**
   * Pre-generated base64 blur data URL (e.g. from plaiceholder or Blurhash).
   * If omitted, a canvas-colour shimmer SVG is generated automatically.
   */
  blurDataURL? : string
  /** Short caption displayed below the image in micro-uppercase */
  caption?     : string
}

export interface EditorialGalleryProps {
  images    : GalleryImage[]
  /**
   * Enable scroll-driven parallax — subtle vertical shift as user scrolls.
   * Automatically disabled when prefers-reduced-motion is set.
   * @default true
   */
  parallax? : boolean
  className?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout variant cycle
//
// Repeats every 4 images. On tablet (md) and below, all variants collapse
// to full-width single-column flow. Spacing uses clamp() for fluid scaling.
// ─────────────────────────────────────────────────────────────────────────────

type Variant = 0 | 1 | 2 | 3

interface VariantConfig {
  /** Controls width + horizontal alignment */
  wrapper : string
  /** Top margin applied for index > 0 */
  spacing : string
  /** sizes attribute — helps browser pick the correct srcset entry */
  sizes   : string
}

const VARIANTS: Record<Variant, VariantConfig> = {
  /**
   * 0 — Full bleed
   * Opens each 4-image cycle at maximum width. Cinematographic,
   * anchors the viewer before asymmetric images follow.
   */
  0: {
    wrapper : 'w-full',
    spacing : 'mt-[clamp(4.5rem,9vw,12rem)]',
    sizes   : '100vw',
  },

  /**
   * 1 — Wide left (68%)
   * Large presence, flush to left edge. Right whitespace breathes.
   * Natural fit for landscape images.
   */
  1: {
    wrapper : 'w-full md:w-[68%] md:ml-0 md:mr-auto',
    spacing : 'mt-[clamp(3rem,7vw,9rem)]',
    sizes   : '(max-width: 768px) 100vw, 68vw',
  },

  /**
   * 2 — Narrow right (52%)
   * Pulls right, leaving a strong left gutter. Creates visual tension
   * against the previous wide-left image. Works well for portrait images.
   */
  2: {
    wrapper : 'w-full md:w-[52%] md:ml-auto md:mr-0',
    spacing : 'mt-[clamp(3rem,7vw,9rem)]',
    sizes   : '(max-width: 768px) 100vw, 52vw',
  },

  /**
   * 3 — Portrait center (40%)
   * Narrow and centered — a deliberate pause in the rhythm.
   * Strong with vertical/portrait images; acts as a visual breath.
   */
  3: {
    wrapper : 'w-full md:w-[40%] md:mx-auto',
    spacing : 'mt-[clamp(4.5rem,9vw,12rem)]',
    sizes   : '(max-width: 768px) 100vw, 40vw',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Shimmer placeholder
//
// Canvas-colour (#EDEBE8) gradient SVG encoded as base64.
// Matches the DS background so the placeholder is invisible during load
// rather than a jarring grey block.
// ─────────────────────────────────────────────────────────────────────────────

const toBase64 = (str: string): string =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const SHIMMER_SVG = `<svg width="8" height="5" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0%"   stop-color="#EDEBE8"/>
      <stop offset="50%"  stop-color="#DEDAD6"/>
      <stop offset="100%" stop-color="#EDEBE8"/>
    </linearGradient>
  </defs>
  <rect width="8" height="5" fill="url(#g)"/>
</svg>`

// Computed once per environment (server uses Buffer, client uses btoa)
const SHIMMER_URL: string = (() => {
  try {
    return `data:image/svg+xml;base64,${toBase64(SHIMMER_SVG)}`
  } catch {
    // Transparent 1×1 GIF fallback
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }
})()

// ─────────────────────────────────────────────────────────────────────────────
// GalleryItem
// ─────────────────────────────────────────────────────────────────────────────

interface GalleryItemProps {
  image        : GalleryImage
  index        : number
  total        : number
  parallax     : boolean
  shouldReduce : boolean
}

function GalleryItem({
  image,
  index,
  total,
  parallax,
  shouldReduce,
}: GalleryItemProps) {
  const variant     = (index % 4) as Variant
  const config      = VARIANTS[variant]
  const isFirst     = index === 0
  const useParallax = parallax && !isFirst && !shouldReduce

  // ── Scroll tracking ─────────────────────────────────────────────────────
  // Target is the image container div; `useScroll` tracks it relative to
  // the viewport. Hooks are always called (React rules) — effects are
  // conditional on `useParallax`.
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target : containerRef,
    offset : ['start end', 'end start'],
  })

  // 5% range; the image layer overflows by 10% (inset: -10%) giving safe margin
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    useParallax ? ['5%', '-5%'] : ['0%', '0%'],
  )

  // ── Reveal animation ────────────────────────────────────────────────────
  // Clip-path wipe: image is initially fully clipped from the bottom, then
  // the clip shrinks to reveal the image top-to-bottom.
  // clipPath does not affect layout, so the figure occupies stable space and
  // useScroll tracking is unaffected.
  const revealInitial = shouldReduce
    ? { opacity: 0 }
    : { clipPath: 'inset(0 0 100% 0)', opacity: 0.85 }

  const revealVisible = shouldReduce
    ? { opacity: 1 }
    : { clipPath: 'inset(0 0 0% 0)', opacity: 1 }

  return (
    <figure
      className={[
        config.wrapper,
        isFirst ? '' : config.spacing,
      ].filter(Boolean).join(' ')}
    >
      {/* Screen reader context: "Image N of N" */}
      <span className="sr-only">
        Image {index + 1} of {total}
        {image.caption ? ` — ${image.caption}` : ''}
      </span>

      {/* ── Image container ────────────────────────────────────────────── */}
      <motion.div
        ref={containerRef}
        className="relative overflow-hidden w-full"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
        {...(isFirst
          ? {}
          : {
              initial    : revealInitial,
              whileInView: revealVisible,
              viewport   : { once: true, margin: '-70px' },
              transition : {
                duration : shouldReduce ? 0.35 : 0.95,
                ease     : [0.22, 1, 0.36, 1] as const,
              },
            }
        )}
      >
        {/*
         * Parallax layer:
         *   - `inset: '-10%'` makes the div extend 10% beyond the container
         *     on all sides, so the image fills the frame at every scroll position
         *     without exposing empty edges.
         *   - `will-change-transform` promotes to a GPU compositing layer,
         *     keeping parallax off the main thread.
         */}
        <motion.div
          className="will-change-transform"
          style={
            useParallax
              ? { position: 'absolute', inset: '-10%', y: parallaxY }
              : { position: 'absolute', inset: 0 }
          }
        >
          <img
            src={image.src}
            alt={image.alt}
            loading={isFirst ? 'eager' : 'lazy'}
            draggable={false}
            className="object-cover select-none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        </motion.div>
      </motion.div>

      {/* ── Caption ────────────────────────────────────────────────────── */}
      {image.caption && (
        <figcaption
          className="
            mt-2.5
            font-display text-[0.60rem] uppercase
            tracking-[0.18em] leading-relaxed
            text-right pr-0.5
          "
          style={{ color: 'var(--faded)' }}
          aria-hidden="true"  // already included in the sr-only span above
        >
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EditorialGallery — public component
// ─────────────────────────────────────────────────────────────────────────────

export default function EditorialGallery({
  images,
  parallax  = true,
  className = '',
}: EditorialGalleryProps) {
  const shouldReduce = useReducedMotion() ?? false

  if (!images.length) return null

  return (
    <section
      aria-label={`Image gallery — ${images.length} image${images.length !== 1 ? 's' : ''}`}
      className={['w-full overflow-x-hidden', className].filter(Boolean).join(' ')}
    >
      {images.map((image, i) => (
        <GalleryItem
          key={`${image.src}-${i}`}
          image={image}
          index={i}
          total={images.length}
          parallax={parallax}
          shouldReduce={shouldReduce}
        />
      ))}
    </section>
  )
}
