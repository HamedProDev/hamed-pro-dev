export default function NewJobPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
      <div className="max-w-2xl rounded-xl border border-dark-500 bg-dark-700 p-6 space-y-4">
        <div><label className="text-sm text-text-secondary">Job Title</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        <div><label className="text-sm text-text-secondary">Company</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-text-secondary">Location</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
          <div><label className="text-sm text-text-secondary">Type</label><select className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary"><option>full-time</option><option>part-time</option><option>contract</option><option>internship</option><option>freelance</option></select></div>
        </div>
        <div><label className="text-sm text-text-secondary">Description</label><textarea className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary h-32" /></div>
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Post Job</button>
      </div>
    </div>
  )
}
