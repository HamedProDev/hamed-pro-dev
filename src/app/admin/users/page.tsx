export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="rounded-xl border border-dark-500 bg-dark-700 overflow-hidden">
        <table className="w-full text-sm"><thead><tr className="border-b border-dark-500"><th className="px-4 py-3 text-left text-text-secondary">Name</th><th className="px-4 py-3 text-left text-text-secondary">Email</th><th className="px-4 py-3 text-left text-text-secondary">Role</th><th className="px-4 py-3 text-left text-text-secondary">Actions</th></tr></thead>
        <tbody><tr><td colSpan={4} className="px-4 py-8 text-center text-text-muted">No users yet.</td></tr></tbody></table>
      </div>
    </div>
  )
}
