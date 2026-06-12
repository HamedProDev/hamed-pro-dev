'use client'

const categories = ['All', 'Large', 'Mini', 'School']
const subCategories = ['All', 'Finance', 'Education', 'Sports', 'Banking', 'Healthcare', 'Agriculture', 'E-commerce', 'AI/ML', 'Other']

interface Props { activeCategory: string; activeSubCategory: string; onCategoryChange: (c: string) => void; onSubCategoryChange: (c: string) => void }

export function ProjectFilters({ activeCategory, activeSubCategory, onCategoryChange, onSubCategoryChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-2">Project Type</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => onCategoryChange(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === c ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary border border-dark-500 hover:text-text-primary'}`}>{c}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-2">Industry</h4>
        <div className="flex flex-wrap gap-2">
          {subCategories.map(c => (
            <button key={c} onClick={() => onSubCategoryChange(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSubCategory === c ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary border border-dark-500 hover:text-text-primary'}`}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
