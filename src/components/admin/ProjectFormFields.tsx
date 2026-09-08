'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { X, Plus } from 'lucide-react'

export interface ProjectFormState {
  title: string
  description: string
  longDescription: string
  coverImage: string
  category: string
  status: string
  client: string
  year: string
  role: string
  techStack: string[]
  tags: string[]
  demoUrl: string
  sourceUrl: string
  screenshots: string[]
  featured: boolean
  isPublished: boolean
}

export const emptyProjectForm: ProjectFormState = {
  title: '',
  description: '',
  longDescription: '',
  coverImage: '',
  category: 'large',
  status: 'Completed',
  client: '',
  year: '',
  role: 'Full Stack Developer',
  techStack: [],
  tags: [],
  demoUrl: '',
  sourceUrl: '',
  screenshots: [],
  featured: false,
  isPublished: true,
}

function TagInput({ label, id, value, onChange, placeholder }: { label: string; id: string; value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [text, setText] = useState('')

  const add = () => {
    const v = text.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setText('')
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium mb-1 block">{label}</label>
      <div className="flex items-center gap-2 mb-2">
        <Input
          id={id}
          name={id}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
          }}
          onBlur={add}
          placeholder={placeholder}
        />
        <button type="button" onClick={add} className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary" aria-label={`Add ${label}`}><Plus className="h-4 w-4" /></button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(t => (
            <span key={t} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              {t}
              <button type="button" onClick={() => onChange(value.filter(x => x !== t))} className="hover:text-red-400" aria-label={`Remove ${t}`}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectFormFields({ form, update }: { form: ProjectFormState; update: (key: string, value: any) => void }) {
  const setScreenshot = (i: number, url: string) => {
    const next = [...form.screenshots]
    next[i] = url
    update('screenshots', next)
  }
  const removeScreenshot = (i: number) => update('screenshots', form.screenshots.filter((_, idx) => idx !== i))

  return (
    <>
      <div>
        <label htmlFor="proj-title" className="text-sm font-medium mb-1 block">Title *</label>
        <Input id="proj-title" name="title" required value={form.title} onChange={e => update('title', e.target.value)} placeholder="My Awesome Project" />
      </div>
      <div>
        <label htmlFor="proj-description" className="text-sm font-medium mb-1 block">Short Description *</label>
        <Input id="proj-description" name="description" required maxLength={200} value={form.description} onChange={e => update('description', e.target.value)} placeholder="One-line pitch (max 200 chars)" />
      </div>
      <div>
        <label htmlFor="proj-longDescription" className="text-sm font-medium mb-1 block">Long Description (Markdown supported)</label>
        <Textarea id="proj-longDescription" name="longDescription" rows={7} value={form.longDescription} onChange={e => update('longDescription', e.target.value)} placeholder="Problem, solution, features, architecture… (supports **bold**, lists)" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Cover Image</label>
        <ImageUpload value={form.coverImage} onChange={v => update('coverImage', v)} folder="hamedpro/projects" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="proj-category" className="text-sm font-medium mb-1 block">Category</label>
          <select id="proj-category" name="category" value={form.category} onChange={e => update('category', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm">
            <option value="large">Large Project</option><option value="mini">Mini Project</option><option value="school">School Project</option><option value="ai">AI / ML</option><option value="mobile">Mobile App</option><option value="saas">SaaS</option>
          </select>
        </div>
        <div>
          <label htmlFor="proj-status" className="text-sm font-medium mb-1 block">Status</label>
          <select id="proj-status" name="status" value={form.status} onChange={e => update('status', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm">
            <option>Completed</option><option>In Progress</option><option>Beta</option><option>Maintained</option><option>Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="proj-client" className="text-sm font-medium mb-1 block">Client / For</label>
          <Input id="proj-client" name="client" value={form.client} onChange={e => update('client', e.target.value)} placeholder="Client or 'Personal'" />
        </div>
        <div>
          <label htmlFor="proj-year" className="text-sm font-medium mb-1 block">Year</label>
          <Input id="proj-year" name="year" value={form.year} onChange={e => update('year', e.target.value)} placeholder="2026" />
        </div>
        <div>
          <label htmlFor="proj-role" className="text-sm font-medium mb-1 block">My Role</label>
          <Input id="proj-role" name="role" value={form.role} onChange={e => update('role', e.target.value)} placeholder="Full Stack Developer" />
        </div>
      </div>

      <TagInput label="Tech Stack" id="proj-techStack" value={form.techStack} onChange={v => update('techStack', v)} placeholder="Add a technology and press Enter" />
      <TagInput label="Tags" id="proj-tags" value={form.tags} onChange={v => update('tags', v)} placeholder="Add a tag and press Enter" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="proj-demoUrl" className="text-sm font-medium mb-1 block">Demo URL</label>
          <Input id="proj-demoUrl" name="demoUrl" value={form.demoUrl} onChange={e => update('demoUrl', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label htmlFor="proj-sourceUrl" className="text-sm font-medium mb-1 block">Source URL</label>
          <Input id="proj-sourceUrl" name="sourceUrl" value={form.sourceUrl} onChange={e => update('sourceUrl', e.target.value)} placeholder="https://github.com/..." />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Screenshots / Gallery</label>
        <div className="grid grid-cols-2 gap-3">
          {form.screenshots.map((s, i) => (
            <div key={i} className="relative rounded-xl border border-border-primary overflow-hidden">
              <ImageUpload value={s} onChange={v => setScreenshot(i, v)} folder="hamedpro/projects/screenshots" />
              <button type="button" onClick={() => removeScreenshot(i)} className="absolute top-2 right-2 p-1 rounded-lg bg-surface-card/90 text-text-muted hover:text-red-400" aria-label="Remove screenshot"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update('screenshots', [...form.screenshots, ''])}
            className="h-28 rounded-xl border-2 border-dashed border-border-primary flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-primary/40 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" /> Add screenshot
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor="proj-featured" className="flex items-center gap-2 cursor-pointer"><input id="proj-featured" name="featured" type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="rounded accent-brand-primary" /><span className="text-sm text-text-secondary">Featured</span></label>
        <label htmlFor="proj-isPublished" className="flex items-center gap-2 cursor-pointer"><input id="proj-isPublished" name="isPublished" type="checkbox" checked={form.isPublished} onChange={e => update('isPublished', e.target.checked)} className="rounded accent-brand-primary" /><span className="text-sm text-text-secondary">Published</span></label>
      </div>
    </>
  )
}
