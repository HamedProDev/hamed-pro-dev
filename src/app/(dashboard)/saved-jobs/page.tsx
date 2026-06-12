import type { Metadata } from 'next'
import { Bookmark } from 'lucide-react'
export const metadata: Metadata = { title: 'Saved Jobs' }

export default function SavedJobsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>
      <div className="rounded-xl border border-dark-500 bg-dark-700 p-12 text-center">
        <Bookmark className="h-12 w-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
        <p className="text-sm text-text-secondary">Browse jobs and save the ones you like.</p>
      </div>
    </div>
  )
}
