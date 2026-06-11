import type { ComponentProps } from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

type LexicalData = ComponentProps<typeof LexicalRichText>['data']

// Payload Lexical richText -> React. Field değerleri doğrudan geçilebilir.
export function RichText({ data, className }: { data?: unknown; className?: string }) {
  if (!data) return null
  return <LexicalRichText data={data as LexicalData} className={className} />
}
