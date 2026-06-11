import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays } from 'lucide-react'

import { getBlogPostBySlug, getBlogPosts } from '@/lib/payload'
import { formatDate } from '@/lib/format'
import { blogCategoryLabel } from '@/lib/blog'
import { absoluteUrl, SITE_NAME } from '@/lib/site'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { RichText } from '@/components/site/RichText'
import { JsonLd } from '@/components/site/JsonLd'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt || undefined,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: SITE_NAME },
    publisher: { '@type': 'Person', name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  }

  return (
    <>
      <JsonLd data={articleLd} />
      <Section>
        <Container className="flex max-w-3xl flex-col gap-6">
          <Link
            href="/blog"
            className="text-sage-700 inline-flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="size-4" />
            Tüm yazılar
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-sage-50 text-sage-700 rounded-full px-3 py-1 font-medium">
              {blogCategoryLabel(post.category)}
            </span>
            {post.publishedAt ? (
              <span className="text-muted-foreground inline-flex items-center gap-1">
                <CalendarDays className="size-4" />
                {formatDate(post.publishedAt)}
              </span>
            ) : null}
          </div>

          <h1 className="text-sage-900 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {post.title}
          </h1>

          <div className="from-sage-200 to-sage-50 aspect-[16/9] rounded-2xl bg-gradient-to-br" />

          {post.body ? (
            <RichText data={post.body} className="prose prose-lg mt-2 max-w-none" />
          ) : null}
        </Container>
      </Section>
    </>
  )
}
