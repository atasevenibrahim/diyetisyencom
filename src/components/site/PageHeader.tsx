import { Container } from './Container'

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <section className="bg-sage-50 border-sage-200/60 border-b">
      <Container className="flex flex-col items-start gap-3 py-14 sm:py-20">
        {eyebrow ? (
          <span className="text-sage-700 text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-sage-900 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-lg text-pretty">{description}</p>
        ) : null}
      </Container>
    </section>
  )
}
