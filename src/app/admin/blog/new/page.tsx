export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">New Blog Post</h1>
      <div className="max-w-3xl rounded-xl border border-dark-500 bg-dark-700 p-6 space-y-4">
        <div><label className="text-sm text-text-secondary">Title</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        <div><label className="text-sm text-text-secondary">Excerpt</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-text-secondary">Category</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
          <div><label className="text-sm text-text-secondary">Tags (comma separated)</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" /></div>
        </div>
        <div><label className="text-sm text-text-secondary">Content (Markdown)</label><textarea className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary font-mono h-64" placeholder="Write your post in Markdown..." /></div>
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Publish Post</button>
      </div>
    </div>
  )
}
