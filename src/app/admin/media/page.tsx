export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Media Library</h1>
      <div className="rounded-xl border border-dark-500 bg-dark-700 border-dashed p-12 text-center">
        <p className="text-text-muted mb-4">Drag and drop files here, or click to upload.</p>
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Upload Files</button>
      </div>
    </div>
  )
}
