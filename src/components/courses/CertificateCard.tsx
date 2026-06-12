import { Card, CardContent } from '@/components/ui/card'
import { Award } from 'lucide-react'

interface CertificateCardProps {
  courseName: string
  completedAt: string
}

export function CertificateCard({ courseName, completedAt }: CertificateCardProps) {
  return (
    <Card className="border-brand-primary/30 bg-brand-primary/5">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <Award className="h-6 w-6 text-brand-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">{courseName}</h3>
          <p className="text-sm text-text-secondary">Completed on {new Date(completedAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
