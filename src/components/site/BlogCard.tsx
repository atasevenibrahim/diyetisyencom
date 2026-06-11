import Link from 'next/link'
import { ArrowRight, CalendarDays, Newspaper } from 'lucide-react'

import type { BlogPost } from '@/payload-types'
import { formatDate } from '@/lib/format'
import { blogCategoryLabel } from '@/lib/blog'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border-sage-200 hover:border-sage-500 flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="from-sage-200 to-sage-50 flex aspect-[16/9] items-center justify-center bg-gradient-to-br">
        <Newspaper className="text-sage-500 size-10" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-sage-50 text-sage-700 rounded-full px-2.5 py-1 font-medium">
            {blogCategoryLabel(post.category)}
          </span>
          {post.publishedAt ? (
            <span className="text-muted-foreground inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {formatDate(post.publishedAt)}
            </span>
          ) : null}
        </div>
        <h3 className="text-sage-900 text-lg leading-snug font-semibold">{post.title}</h3>
        {post.excerpt ? (
          <p className="text-muted-foreground flex-1 text-sm leading-relaxed">{post.excerpt}</p>
        ) : null}
        <span className="text-sage-700 mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium">
          Yazıyı oku
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
