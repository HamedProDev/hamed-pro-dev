export default function CVPage() {
  return (
    <div className="section-padding">
      <div className="container-wide max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Hamed Hussein</h1>
        <p className="text-brand-primary text-lg mb-1">Fullstack & AI/ML Engineer</p>
        <p className="text-text-secondary mb-8">Kigali, Rwanda • hello@hamedpro.rw • github.com/hamedProDev</p>
        <div className="space-y-8">
          <section><h2 className="text-xl font-bold border-b border-dark-500 pb-2 mb-4">Experience</h2><div className="space-y-4"><div><h3 className="font-semibold">Fullstack Developer — Kwanda Facility</h3><p className="text-sm text-text-muted">2021 — Present</p><p className="text-sm text-text-secondary mt-1">Building enterprise systems and digital solutions for Rwandan businesses.</p></div></div></section>
          <section><h2 className="text-xl font-bold border-b border-dark-500 pb-2 mb-4">Skills</h2><div className="flex flex-wrap gap-2">{['React','Next.js','TypeScript','Node.js','Python','MongoDB','Docker','AI/ML'].map(s => <span key={s} className="px-3 py-1 text-xs rounded-full border border-dark-500 bg-dark-700 text-text-secondary">{s}</span>)}</div></section>
          <section><h2 className="text-xl font-bold border-b border-dark-500 pb-2 mb-4">Education</h2><p className="font-semibold">Computer Science</p><p className="text-sm text-text-secondary">University — Focus on AI/ML</p></section>
        </div>
      </div>
    </div>
  )
}
