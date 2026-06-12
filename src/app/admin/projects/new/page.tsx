export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Project</h1>
      <div className="max-w-2xl rounded-xl border border-dark-500 bg-dark-700 p-6 space-y-4">
        <div><label className="text-sm text-text-secondary">Title</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        <div><label className="text-sm text-text-secondary">Description</label><textarea className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary h-20" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-text-secondary">Category</label><select className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary"><option>large</option><option>mini</option><option>school</option></select></div>
          <div><label className="text-sm text-text-secondary">Status</label><select className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary"><option>in-progress</option><option>live</option><option>archived</option></select></div>
        </div>
        <div><label className="text-sm text-text-secondary">Tech Stack (comma separated)</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" placeholder="React, Node.js, MongoDB" /></div>
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Create Project</button>
      </div>
    </div>
  )
}
