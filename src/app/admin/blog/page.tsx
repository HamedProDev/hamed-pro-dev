import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminBlogPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><h1 className="text-3xl font-bold">Blog Posts</h1><Button asChild><Link href="/admin/blog/new">+ New Post</Link></Button></div>
      <div className="rounded-xl border border-dark-500 bg-dark-700 overflow-hidden">
        <table className="w-full text-sm"><thead><tr className="border-b border-dark-500"><th className="px-4 py-3 text-left text-text-secondary">Title</th><th className="px-4 py-3 text-left text-text-secondary">Category</th><th className="px-4 py-3 text-left text-text-secondary">Views</th><th className="px-4 py-3 text-left text-text-secondary">Actions</th></tr></thead>
        <tbody><tr><td colSpan={4} className="px-4 py-8 text-center text-text-muted">No blog posts yet.</td></tr></tbody></table>
      </div>
    </div>
  )
}
