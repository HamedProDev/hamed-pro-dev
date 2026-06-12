import { PostCard } from './PostCard'

interface Post { _id: string; title: string; slug: string; excerpt: string; category: string; readingTime: number }

export function PostGrid({ posts }: { posts: Post[] }) {
  if (!posts.length) return <p className="text-text-muted text-center py-12">No posts found.</p>
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(p => <PostCard key={p._id} {...p} />)}
    </div>
  )
}
