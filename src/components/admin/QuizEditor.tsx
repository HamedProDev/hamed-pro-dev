'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

interface QuizEditorProps {
  title?: string
  description?: string
  value: QuizQuestion[]
  onChange: (quiz: QuizQuestion[]) => void
}

export function QuizEditor({ title = 'Quiz Questions', description = 'Add questions students must answer (70%+ to pass).', value, onChange }: QuizEditorProps) {
  const quiz: QuizQuestion[] = value || []

  const addQuiz = () => onChange([...quiz, { question: '', options: ['', ''], correctIndex: 0, explanation: '' }])

  const updateQuiz = (i: number, key: keyof QuizQuestion, v: any) => {
    const next = [...quiz]
    next[i] = { ...next[i], [key]: v }
    onChange(next)
  }

  const updateQuizOption = (qIdx: number, oIdx: number, v: string) => {
    const next = [...quiz]
    const options = [...next[qIdx].options]
    options[oIdx] = v
    next[qIdx] = { ...next[qIdx], options }
    onChange(next)
  }

  const addQuizOption = (qIdx: number) => {
    const next = [...quiz]
    next[qIdx] = { ...next[qIdx], options: [...next[qIdx].options, ''] }
    onChange(next)
  }

  const removeQuiz = (i: number) => onChange(quiz.filter((_, idx) => idx !== i))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={addQuiz}><Plus className="h-3 w-3 mr-1" /> Add Question</Button>
        </div>
        <p className="text-sm text-text-muted">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {quiz.length === 0 && <p className="text-sm text-text-muted">No questions added.</p>}
        {quiz.map((q, qIdx) => (
          <div key={qIdx} className="p-4 rounded-xl border border-border-primary bg-surface-secondary/40 space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-text-muted mt-2">{qIdx + 1}.</span>
              <Input className="flex-1" placeholder="Question" value={q.question} onChange={e => updateQuiz(qIdx, 'question', e.target.value)} />
              <button type="button" onClick={() => removeQuiz(qIdx)} aria-label="Remove question" className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`quiz-correct-${qIdx}`}
                    checked={q.correctIndex === oIdx}
                    onChange={() => updateQuiz(qIdx, 'correctIndex', oIdx)}
                    aria-label={`Mark option ${oIdx + 1} as correct`}
                    className="accent-brand-primary"
                  />
                  <Input className="flex-1" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={e => updateQuizOption(qIdx, oIdx, e.target.value)} />
                  {oIdx === q.options.length - 1 && (
                    <Button type="button" size="sm" variant="ghost" onClick={() => addQuizOption(qIdx)} aria-label="Add option"><Plus className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
            </div>
            <Input value={q.explanation || ''} onChange={e => updateQuiz(qIdx, 'explanation', e.target.value)} placeholder="Optional explanation shown after answering" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
