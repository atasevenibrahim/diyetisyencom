import {
  Activity,
  Baby,
  Flower2,
  Gauge,
  Leaf,
  Scale,
  Shield,
  Syringe,
  Target,
  Video,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  scale: Scale,
  activity: Activity,
  flower: Flower2,
  shield: Shield,
  baby: Baby,
  syringe: Syringe,
  target: Target,
  leaf: Leaf,
  video: Video,
  gauge: Gauge,
}

export function ServiceIcon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = (name && map[name]) || Leaf
  return <Cmp className={className} aria-hidden="true" />
}
