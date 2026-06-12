import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Admin Dashboard' }

export default function AdminDashboard() {
  const stats = [
    { label: 'Projects', value: 0 },
    { label: 'Courses', value: 0 },
    { label: 'Blog Posts', value: 0 },
    { label: 'Jobs', value: 0 },
    { label: 'Users', value: 0 },
    { label: 'Subscribers', value: 0 },
  ]
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-dark-500 bg-dark-700 p-4 text-center">
            <p className="text-2xl font-bold text-brand-primary">{s.value}</p>
            <p className="text-sm text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-dark-500 bg-dark-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            {['New Project', 'New Course', 'New Blog Post', 'New Job'].map(a => (
              <button key={a} className="px-3 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-sm hover:bg-brand-primary/20 transition-colors">{a}</button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-dark-500 bg-dark-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-sm text-text-muted">No recent activity.</p>
        </div>
      </div>
    </div>
  )
}
