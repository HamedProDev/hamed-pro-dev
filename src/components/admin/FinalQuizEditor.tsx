'use client'
import { QuizEditor, type QuizQuestion } from '@/components/admin/QuizEditor'

export type { QuizQuestion }

interface FinalQuizEditorProps {
  value: QuizQuestion[]
  onChange: (quiz: QuizQuestion[]) => void
}

export function FinalQuizEditor({ value, onChange }: FinalQuizEditorProps) {
  return (
    <QuizEditor
      title="Final Assessment"
      description="Students must pass this quiz (70%+) to earn their certificate. Leave empty to issue the certificate automatically."
      value={value}
      onChange={onChange}
    />
  )
}
