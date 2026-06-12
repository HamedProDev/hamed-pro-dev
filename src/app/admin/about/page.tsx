export default function AdminAboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit About Page</h1>
      <div className="max-w-3xl rounded-xl border border-dark-500 bg-dark-700 p-6 space-y-4">
        <div><label className="text-sm text-text-secondary">Full Name</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" defaultValue="Hamed Hussein" /></div>
        <div><label className="text-sm text-text-secondary">Tagline</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" defaultValue="Fullstack & AI/ML Engineer" /></div>
        <div><label className="text-sm text-text-secondary">Bio (Markdown)</label><textarea className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary font-mono h-40" /></div>
        <div><label className="text-sm text-text-secondary">Avatar URL</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Save Changes</button>
      </div>
    </div>
  )
}
