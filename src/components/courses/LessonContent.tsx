'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface LessonContentProps {
  content: string
  type: string
  youtubeUrl?: string
}

export function LessonContent({ content, type, youtubeUrl }: LessonContentProps) {
  return (
    <div className="space-y-6">
      {type === 'video' && youtubeUrl && (
        <div className="aspect-video rounded-xl overflow-hidden bg-dark-800">
          <iframe src={youtubeUrl} className="w-full h-full" allowFullScreen title="Lesson video" />
        </div>
      )}
      {content && (
        <div className="prose prose-invert prose-headings:text-text-primary prose-p:text-text-secondary max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
