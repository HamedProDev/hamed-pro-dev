export default function AdminEmailPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Email Broadcast</h1>
      <div className="max-w-2xl rounded-xl border border-dark-500 bg-dark-700 p-6 space-y-4">
        <div><label className="text-sm text-text-secondary">Subject</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        <div><label className="text-sm text-text-secondary">Recipients</label><select className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary"><option>All Subscribers</option></select></div>
        <div><label className="text-sm text-text-secondary">Content</label><textarea className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary h-40" /></div>
        <div className="flex gap-3"><button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Send Email</button><button className="px-4 py-2 rounded-lg bg-dark-600 text-text-primary text-sm border border-dark-500">Send Test</button></div>
      </div>
    </div>
  )
}
