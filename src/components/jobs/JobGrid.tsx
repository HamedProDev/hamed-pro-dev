import { JobCard } from './JobCard'

export function JobGrid({ jobs }: { jobs: any[] }) {
  if (!jobs.length) return <p className="text-text-muted text-center py-12">No jobs found.</p>
  return (
    <div className="space-y-4">
      {jobs.map(job => <JobCard key={job._id} {...job} />)}
    </div>
  )
}
