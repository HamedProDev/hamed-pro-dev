export default function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="section-padding">
      <div className="container-wide max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Job Details</h1>
        <p className="text-text-secondary">Job details will be loaded from MongoDB.</p>
      </div>
    </div>
  )
}
