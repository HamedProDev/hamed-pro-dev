import { ProjectCard } from './ProjectCard'

interface Project { _id: string; title: string; slug: string; description: string; techStack: string[]; status: string; demoUrl?: string; sourceUrl?: string }

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="text-text-muted text-center py-12">No projects found.</p>
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(p => <ProjectCard key={p._id} {...p} />)}
    </div>
  )
}
