import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import CaseStudyLayout from '@/components/case-study/CaseStudyLayout'
import { getProjectBySlug } from '@/lib/data/sample-project'

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate  = useNavigate()
  const project   = getProjectBySlug(slug ?? '')

  useEffect(() => {
    if (!project) navigate('/404', { replace: true })
  }, [project, navigate])

  if (!project) return null

  const { seo, hero, slug: projectSlug } = project

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords.join(', ')} />}
        <link rel="canonical" href={seo.canonical ?? `https://ericamazzola.com/work/${projectSlug}`} />
        <meta property="og:title"       content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type"        content="article" />
        <meta property="og:image"       content={seo.ogImage} />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image"       content={seo.ogImage} />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context'     : 'https://schema.org',
            '@type'        : 'CreativeWork',
            name           : hero.title,
            description    : seo.description,
            creator        : { '@type': 'Person', name: 'Erica Mazzola', url: 'https://ericamazzola.com' },
            genre          : hero.category,
            locationCreated: hero.location,
            image          : seo.ogImage,
            url            : seo.canonical ?? `https://ericamazzola.com/work/${projectSlug}`,
          }),
        }}
      />

      <CaseStudyLayout data={project} />
    </>
  )
}
