'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export function PostContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-brand-primary prose-code:text-brand-accent prose-pre:bg-dark-800 max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  )
}
