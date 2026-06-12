import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-dark-500 bg-dark-700 p-6"><h3 className="text-lg font-semibold mb-1">My Courses</h3><p className="text-3xl font-bold text-brand-primary">0</p><p className="text-sm text-text-muted">Enrolled courses</p></div>
        <div className="rounded-xl border border-dark-500 bg-dark-700 p-6"><h3 className="text-lg font-semibold mb-1">Saved Jobs</h3><p className="text-3xl font-bold text-brand-primary">0</p><p className="text-sm text-text-muted">Bookmarked jobs</p></div>
        <div className="rounded-xl border border-dark-500 bg-dark-700 p-6"><h3 className="text-lg font-semibold mb-1">Certificates</h3><p className="text-3xl font-bold text-brand-primary">0</p><p className="text-sm text-text-muted">Earned certificates</p></div>
      </div>
    </div>
  )
}
