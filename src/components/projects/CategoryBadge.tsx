import { Badge } from '@/components/ui/badge'

const categoryColors: Record<string, string> = {
  finance: 'bg-green-500/20 text-green-400',
  education: 'bg-blue-500/20 text-blue-400',
  sports: 'bg-orange-500/20 text-orange-400',
  banking: 'bg-purple-500/20 text-purple-400',
  healthcare: 'bg-red-500/20 text-red-400',
  ecommerce: 'bg-yellow-500/20 text-yellow-400',
  agriculture: 'bg-lime-500/20 text-lime-400',
  'ai-ml': 'bg-brand-primary/20 text-brand-primary',
  other: 'bg-gray-500/20 text-gray-400',
}

export function CategoryBadge({ category }: { category: string }) {
  return <Badge variant="outline" className={categoryColors[category] || categoryColors.other}>{category}</Badge>
}
