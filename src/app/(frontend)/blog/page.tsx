import type { Metadata } from 'next'

import { getBlogPosts } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { BlogCard } from '@/components/site/BlogCard'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Beslenme, kilo yönetimi, hastalıklar ve sağlıklı yaşam üzerine uzman diyetisyen yazıları.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Beslenme ve sağlıklı yaşam"
        description="Bilim temelli, sade ve uygulanabilir yazılar."
      />
      <Section>
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Yakında ilk yazılar burada olacak.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
