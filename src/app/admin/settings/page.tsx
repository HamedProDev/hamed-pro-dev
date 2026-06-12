export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <div className="max-w-2xl rounded-xl border border-dark-500 bg-dark-700 p-6 space-y-4">
        <div><label className="text-sm text-text-secondary">Site Name</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" defaultValue="HamedProDev" /></div>
        <div><label className="text-sm text-text-secondary">Tagline</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" defaultValue="Fullstack & AI/ML Developer" /></div>
        <div className="flex items-center gap-3"><input type="checkbox" id="maintenance" className="rounded" /><label htmlFor="maintenance" className="text-sm text-text-secondary">Maintenance Mode</label></div>
        <div className="flex items-center gap-3"><input type="checkbox" id="registration" className="rounded" defaultChecked /><label htmlFor="registration" className="text-sm text-text-secondary">Allow Registration</label></div>
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Save Settings</button>
      </div>
    </div>
  )
}
