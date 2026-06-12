'use client'

const locationTypes = ['All', 'Remote', 'Onsite', 'Hybrid']
const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
const categories = ['All', 'Frontend', 'Backend', 'Fullstack', 'Mobile', 'AI/ML', 'DevOps', 'Design']

interface Props {
  filters: { locationType: string; type: string; category: string }
  onFilterChange: (key: string, value: string) => void
}

export function JobFilters({ filters, onFilterChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-2">Location</h4>
        <div className="flex flex-wrap gap-2">
          {locationTypes.map(l => (
            <button key={l} onClick={() => onFilterChange('locationType', l)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filters.locationType === l ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary border border-dark-500 hover:text-text-primary'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-2">Job Type</h4>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map(t => (
            <button key={t} onClick={() => onFilterChange('type', t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filters.type === t ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary border border-dark-500 hover:text-text-primary'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-2">Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => onFilterChange('category', c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filters.category === c ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary border border-dark-500 hover:text-text-primary'}`}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
