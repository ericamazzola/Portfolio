// ─────────────────────────────────────────────────────────────────────────────
// Case Study — Type System
// ─────────────────────────────────────────────────────────────────────────────

export interface SeoMeta {
  title       : string
  description : string
  ogImage     : string
  keywords?   : string[]
  canonical?  : string
}

/** Riga metadata con pattern (Label.) — uguale a project-case-study.html */
export interface MetaRow {
  label : string
  value : string
  /** Se true, valore in Instrument Serif italic */
  long? : boolean
}

/** Immagine della gallery 3×3 */
export interface GridImage {
  src      : string
  alt      : string
  width    : number
  height   : number
  /** Immagine alternativa mostrata sull'hover */
  hoverSrc?: string
}

export interface CaseStudy {
  slug : string
  seo  : SeoMeta

  hero: {
    /** Nome progetto — usato come label "(Nome.)" */
    title    : string
    category : string
    location : string
    year?    : string
    service  : string
  }

  story: {
    /** Grande heading serif — frase narrativa */
    title      : string
    /** Paragrafi del corpo testo */
    paragraphs : string[]
  }

  metadata: {
    rows: MetaRow[]
  }

  /** Immagini progetto — 6 per la gallery 3×2, la 7ª usata come featured image */
  gridImages: GridImage[]

  /** Colori opzionali per personalizzare la pagina progetto */
  theme?: {
    bg?           : string   // sfondo pagina
    text?         : string   // colore testo principale
    logoColor?    : string   // colore "Erica Mazzola" in nav
    titleColor?   : string   // colore titolo marquee
    headerBg?     : string   // sfondo sezione header (default #112E12)
    headerCursor?          : boolean  // usa immagine header come cursore nella sezione header
    headerCursorMaxHeight? : number   // altezza max immagine cursore in px (default 400)
  }

  /** Credit opzionale — es. copywriting agency */
  credit?: {
    label : string
    name  : string
    href  : string
  }

  related: {
    slug       : string
    title      : string
    category   : string
    coverImage : { src: string; alt: string; width: number; height: number }
  }[]

  cta: {
    headline : string
    label    : string
    href     : string
  }
}
