import type { CaseStudy } from '@/lib/types/case-study'

// ─────────────────────────────────────────────────────────────────────────────
// Sample project — uses picsum.photos so the page renders without real assets.
// Replace with your own images and copy before shipping.
// ─────────────────────────────────────────────────────────────────────────────

export const sampleProject: CaseStudy = {
  slug: 'forma-studio',

  seo: {
    title       : 'Forma Studio — Erica Mazzola',
    description : 'Brand identity completa per Forma Studio, studio di architettura e interior design milanese.',
    ogImage     : 'https://picsum.photos/seed/fs-hero/1200/630',
    keywords    : ['brand identity', 'architettura', 'logo', 'visual identity', 'milano'],
    canonical   : 'https://ericamazzola.com/work/forma-studio',
  },

  hero: {
    title    : 'Forma Studio',
    category : 'Brand Identity',
    location : 'Milano, IT',
    year     : '2024',
    service  : 'Visual Identity',
  },

  story: {
    title      : "Un sistema visivo nato dalla struttura, dal rigore e dall'eleganza dei materiali.",
    paragraphs : [
      "Forma Studio è uno studio di architettura d'interni milanese che voleva un sistema d'identità capace di rispecchiare la sua filosofia: rigore geometrico, materiali naturali e spazio come narrazione silenziosa. Clean silhouettes e pelletteria premium come alternativa alla omologazione del mercato — pezzi senza tempo, pensati per essere vissuti, indossati spesso e amati per anni.",
    ],
  },

  metadata: {
    rows: [
      { label: 'Service', value: 'Visual Identity' },
      { label: 'Realm',   value: 'Style' },
      { label: 'Essence', value: 'Tattile, duraturo, sicuro — lusso senza eccesso.', long: true },
    ],
  },

  gridImages: [
    { src: 'https://picsum.photos/seed/fs-g1/800/1000', alt: 'Sistema di cancelleria — spread su lino',       width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g2/800/1000', alt: 'Logomark su texture di calcestruzzo',           width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g3/800/1000', alt: 'Business card — dettaglio letterpress',         width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g4/800/1000', alt: 'Intestazione con logo timbrato',                width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g5/800/1000', alt: 'Grafica per cantiere — Via Tortona',            width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g6/800/1000', alt: 'Mockup applicazione brand — studio',            width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g7/800/1000', alt: 'Dettaglio packaging — retro',                   width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g8/800/1000', alt: 'Biglietto da visita su marmo',                  width: 800, height: 1000 },
    { src: 'https://picsum.photos/seed/fs-g9/800/1000', alt: 'Applicazione digitale — schermata home',        width: 800, height: 1000 },
  ],

  related: [
    {
      slug       : 'lumen-app',
      title      : 'Lumen App',
      category   : 'UI / UX Design',
      coverImage : { src: 'https://picsum.photos/seed/lu-thumb/680/850', alt: 'Lumen App UI preview', width: 680, height: 850 },
    },
    {
      slug       : 'verde-collective',
      title      : 'Verde Collective',
      category   : 'Visual Identity',
      coverImage : { src: 'https://picsum.photos/seed/ve-thumb/680/850', alt: 'Verde Collective brand', width: 680, height: 850 },
    },
  ],

  cta: {
    headline : 'Lavoriamo insieme?',
    label    : 'Contattami',
    href     : 'mailto:erica.mazzola99@gmail.com',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// AuraBloom
// ─────────────────────────────────────────────────────────────────────────────

export const auraBloom: CaseStudy = {
  slug: 'aurabloom',
  seo: {
    title      : 'AuraBloom — Erica Mazzola',
    description: 'Brand identity per AuraBloom, brand di skincare naturale.',
    ogImage    : 'https://picsum.photos/seed/ab-hero/1200/630',
    keywords   : ['brand identity', 'skincare', 'packaging', 'visual identity'],
    canonical  : 'https://ericamazzola.com/work/aurabloom',
  },
  hero: {
    title   : 'AuraBloom',
    category: 'Visual Identity',
    location: 'Milano, IT',
    year    : '2026',
    service : 'Branding',
  },
  story: {
    title     : "Un'identità visiva nata dalla naturalezza, dalla luce e dalla cura di sé.",
    paragraphs: [
      "AuraBloom è un brand di skincare naturale che cercava un sistema d'identità capace di trasmettere purezza, delicatezza e autenticità. Il progetto ha sviluppato un linguaggio visivo morbido e luminoso, con palette cromatica ispirata ai fiori selvatici e tipografia elegante.",
    ],
  },
  metadata: {
    rows: [
      { label: 'Service', value: 'Brand Identity' },
      { label: 'Realm',   value: 'Beauty & Wellness' },
      { label: 'Essence', value: 'Naturale, luminoso, autentico — bellezza senza artifici.', long: true },
    ],
  },
  gridImages: [
    { src: '/images/aurabloom/01.webp', alt: 'AuraBloom — 01', width: 1080, height: 1350 },
    { src: '/images/aurabloom/02.webp', alt: 'AuraBloom — 02', width: 1080, height: 1350 },
    { src: '/images/aurabloom/03.webp', alt: 'AuraBloom — 03', width: 1080, height: 1350 },
    { src: '/images/aurabloom/04.webp', alt: 'AuraBloom — 04', width: 1080, height: 1350 },
    { src: '/images/aurabloom/05.webp', alt: 'AuraBloom — 05', width: 1080, height: 1350 },
    { src: '/images/aurabloom/06.webp', alt: 'AuraBloom — 06', width: 1080, height: 1350 },
    { src: '/images/AI/000_0.webp',     alt: 'AuraBloom — header', width: 1080, height: 1350 },
  ],
  related: [],
  cta: { headline: 'Lavoriamo insieme?', label: 'Contattami', href: 'mailto:erica.mazzola99@gmail.com' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Menelique
// ─────────────────────────────────────────────────────────────────────────────

export const menelique: CaseStudy = {
  slug: 'menelique',
  seo: {
    title      : 'Menelique — Erica Mazzola',
    description: 'Visual identity per Menelique, brand di moda contemporanea.',
    ogImage    : 'https://picsum.photos/seed/mn-hero/1200/630',
    keywords   : ['visual identity', 'moda', 'fashion', 'logo'],
    canonical  : 'https://ericamazzola.com/work/menelique',
  },
  hero: {
    title   : 'Menelique',
    category: 'Editorial Design',
    location: 'Parigi / Milano',
    year    : '2023',
    service : 'Visual Identity',
  },
  story: {
    title     : 'Un sistema segnico contemporaneo per una nuova visione della moda.',
    paragraphs: [
      "Menelique è un brand di moda contemporanea che voleva un'identità visiva forte e distintiva. Il progetto ha lavorato su un sistema di segni minimali ma carichi di tensione espressiva, tra tradizione sartoriale e cultura visiva contemporanea.",
    ],
  },
  metadata: {
    rows: [
      { label: 'Service', value: 'Visual Identity' },
      { label: 'Realm',   value: 'Fashion' },
      { label: 'Essence', value: 'Tagliente, contemporaneo, memorabile — moda come manifesto.', long: true },
    ],
  },
  gridImages: [
    { src: '/images/menelique/DSCF6789.webp', alt: 'Menelique — dettaglio 1', width: 2600, height: 1733 },
    { src: '/images/menelique/DSCF6775.webp', alt: 'Menelique — dettaglio 2', width: 2600, height: 1733 },
    { src: '/images/menelique/DSCF6765.webp', alt: 'Menelique — dettaglio 3', width: 2600, height: 1733 },
    { src: '/images/menelique/DSCF6792.webp', alt: 'Menelique — dettaglio 4', width: 2600, height: 1733 },
    { src: '/images/menelique/DSCF6799.webp', alt: 'Menelique — dettaglio 5', width: 2600, height: 1733 },
    { src: '/images/menelique/DSCF6802.webp', alt: 'Menelique — dettaglio 6', width: 2600, height: 1733 },
    { src: '/images/menelique/DSCF6761.webp', alt: 'Menelique — header',      width: 2600, height: 1733 },
  ],
  theme: {
    bg        : '#000000',
    text      : '#EFF1C7',
    logoColor : '#EFF1C7',
    titleColor: '#EFF1C7',
  },
  related: [],
  cta: { headline: 'Lavoriamo insieme?', label: 'Contattami', href: 'mailto:erica.mazzola99@gmail.com' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Fondazione Tèarte Lecco
// ─────────────────────────────────────────────────────────────────────────────

export const fondazioneTèarteLecco: CaseStudy = {
  slug: 'fondazione-tearte-lecco',
  seo: {
    title      : 'Fondazione Tèarte Lecco — Erica Mazzola',
    description: 'Brand identity ed editorial design per Fondazione Tèarte Lecco.',
    ogImage    : 'https://picsum.photos/seed/ft-hero/1200/630',
    keywords   : ['brand identity', 'editorial', 'fondazione', 'cultura', 'lecco'],
    canonical  : 'https://ericamazzola.com/work/fondazione-tearte-lecco',
  },
  hero: {
    title   : 'Fondazione Tèarte Lecco',
    category: 'Visual Identity',
    location: 'Lecco, IT',
    year    : '2026',
    service : 'Branding',
  },
  story: {
    title     : 'Identità visiva e sistema editoriale per una fondazione culturale del territorio.',
    paragraphs: [
      "Fondazione Tèarte Lecco è un ente culturale che promuove le arti performative e visive nel territorio lecchese. Il progetto ha sviluppato un sistema d'identità coerente — dal logo alla comunicazione editoriale — capace di trasmettere autorevolezza e apertura verso il pubblico.",
    ],
  },
  metadata: {
    rows: [
      { label: 'Service', value: 'Brand Identity · Editorial' },
      { label: 'Realm',   value: 'Cultura & Territorio' },
      { label: 'Essence', value: 'Autorevole, aperto, radicato nel territorio — cultura accessibile.', long: true },
    ],
  },
  gridImages: [
    { src: '/images/fondazione-tearte-lecco/01.webp', alt: 'Fondazione Tèarte — 01', width: 1600, height: 1000 },
    { src: '/images/fondazione-tearte-lecco/02.webp', alt: 'Fondazione Tèarte — 02', width: 1600, height: 1000 },
    { src: '/images/fondazione-tearte-lecco/03.webp', alt: 'Fondazione Tèarte — 03', width: 1600, height: 1000 },
    { src: '/images/fondazione-tearte-lecco/04.webp', alt: 'Fondazione Tèarte — 04', width: 1600, height: 1000 },
    { src: '/images/fondazione-tearte-lecco/08.mp4', alt: 'Fondazione Tèarte — 08', width: 1600, height: 1000 },
    { src: '/images/fondazione-tearte-lecco/06.webp', alt: 'Fondazione Tèarte — 06', width: 1600, height: 1000 },
    { src: '/images/fondazione-tearte-lecco/header-0.webp', alt: 'Fondazione Tèarte — header', width: 1600, height: 700 },
  ],
  theme: {
    headerBg    : '#112E12',
    headerCursor: true,
  },
  credit: {
    label: 'Copywriting',
    name : 'MULTI Marketing Consulting',
    href : 'https://www.multi-consult.com/',
  },
  related: [],
  cta: { headline: 'Lavoriamo insieme?', label: 'Contattami', href: 'mailto:erica.mazzola99@gmail.com' },
}

// ─────────────────────────────────────────────────────────────────────────────
// BergamoScienza
// ─────────────────────────────────────────────────────────────────────────────

export const bergamoScienza: CaseStudy = {
  slug: 'bergamoscienza',
  seo: {
    title      : 'BergamoScienza — Erica Mazzola',
    description: 'Visual identity e comunicazione per BergamoScienza.',
    ogImage    : 'https://picsum.photos/seed/bs-hero/1200/630',
    keywords   : ['visual identity', 'comunicazione', 'science', 'bergamo'],
    canonical  : 'https://ericamazzola.com/work/bergamoscienza',
  },
  hero: {
    title   : 'BergamoScienza',
    category: 'Visual Identity',
    location: 'Bergamo, IT',
    year    : '2025',
    service : 'Branding',
  },
  story: {
    title     : 'Comunicazione visiva per il festival della scienza di Bergamo.',
    paragraphs: [
      "BergamoScienza è il festival internazionale della scienza di Bergamo. Il progetto ha sviluppato un sistema visivo capace di rendere accessibile e coinvolgente un programma ricco e articolato, costruendo un linguaggio che unisce rigore scientifico e curiosità.",
    ],
  },
  metadata: {
    rows: [
      { label: 'Service', value: 'Art Direction' },
      { label: 'Realm',   value: 'Festival / Scienza' },
      { label: 'Essence', value: 'Curioso, aperto, rigoroso — la scienza come spettacolo.', long: true },
    ],
  },
  gridImages: [
    { src: '/images/bergamoscienza/01.webp', alt: 'BergamoScienza — 01', width: 800, height: 1000 },
    { src: '/images/bergamoscienza/02.webp', alt: 'BergamoScienza — 02', width: 800, height: 1000 },
    { src: '/images/bergamoscienza/03.webp', alt: 'BergamoScienza — 03', width: 800, height: 1000 },
    { src: '/images/bergamoscienza/04.webp', alt: 'BergamoScienza — 04', width: 800, height: 1000 },
    { src: '/images/bergamoscienza/05.mp4', alt: 'BergamoScienza — 05', width: 800, height: 1000 },
    { src: '/images/bergamoscienza/06.webp', alt: 'BergamoScienza — 06', width: 800, height: 1000 },
    { src: '/images/bergamoscienza/00.webp', alt: 'BergamoScienza — header', width: 800, height: 1000 },
  ],
  related: [],
  cta: { headline: 'Lavoriamo insieme?', label: 'Contattami', href: 'mailto:erica.mazzola99@gmail.com' },
}

// ─────────────────────────────────────────────────────────────────────────────
// BolognaFirenze2036
// ─────────────────────────────────────────────────────────────────────────────

export const bolognaFirenze2036: CaseStudy = {
  slug: 'bolognafirenze2036',
  seo: {
    title      : 'BolognaFirenze2036 — Erica Mazzola',
    description: 'Campaign e visual identity per BolognaFirenze2036.',
    ogImage    : 'https://picsum.photos/seed/bf-hero/1200/630',
    keywords   : ['campaign', 'visual identity', 'urban', 'cultura', 'bologna', 'firenze'],
    canonical  : 'https://ericamazzola.com/work/bolognafirenze2036',
  },
  hero: {
    title   : 'AI Experiments',
    category: 'AI Design',
    location: 'Bologna / Firenze',
    year    : '2026',
    service : 'Campaign',
  },
  story: {
    title     : 'Una campagna visiva per immaginare due città nel 2036.',
    paragraphs: [
      "BolognaFirenze2036 è un progetto culturale e urbano che immagina il futuro di due città italiane attraverso arte, architettura e comunità. La campagna visiva ha costruito un linguaggio capace di connettere due identità forti in una visione condivisa.",
    ],
  },
  metadata: {
    rows: [
      { label: 'Service', value: 'Campaign · Visual Identity' },
      { label: 'Realm',   value: 'Urban & Culture' },
      { label: 'Essence', value: 'Visionario, connettivo, radicato nel futuro — due città, una voce.', long: true },
    ],
  },
  gridImages: [
    { src: '/images/AI/01.webp', alt: 'BolognaFirenze2036 — 01', width: 800, height: 1000, hoverSrc: '/images/AI/01-A.webp' },
    { src: '/images/AI/02.webp', alt: 'BolognaFirenze2036 — 02', width: 800, height: 1000, hoverSrc: '/images/AI/02-B.webp' },
    { src: '/images/AI/03.webp', alt: 'BolognaFirenze2036 — 03', width: 800, height: 1000, hoverSrc: '/images/AI/03-C.webp' },
    { src: '/images/AI/04.webp', alt: 'BolognaFirenze2036 — 04', width: 800, height: 1000, hoverSrc: '/images/AI/04-D.webp' },
    { src: '/images/AI/05.webp', alt: 'BolognaFirenze2036 — 05', width: 800, height: 1000, hoverSrc: '/images/AI/05-E.webp' },
    { src: '/images/AI/06.webp', alt: 'BolognaFirenze2036 — 06', width: 800, height: 1000, hoverSrc: '/images/AI/06-F.webp' },
    { src: '/images/AI/000.webp', alt: 'BolognaFirenze2036 — header',                      width: 800, height: 1000 },
  ],
  related: [],
  cta: { headline: 'Lavoriamo insieme?', label: 'Contattami', href: 'mailto:erica.mazzola99@gmail.com' },
}

// ── Data helpers ──────────────────────────────────────────────────────────────

const ALL_PROJECTS: CaseStudy[] = [
  sampleProject,
  auraBloom,
  fondazioneTèarteLecco,
  bolognaFirenze2036,
  bergamoScienza,
  menelique,
]

export function getProjectBySlug(slug: string): CaseStudy | undefined {
  return ALL_PROJECTS.find(p => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return ALL_PROJECTS.map(p => p.slug)
}
