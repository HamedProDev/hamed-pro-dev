import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'My Profile' }

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="max-w-2xl rounded-xl border border-dark-500 bg-dark-700 p-6 space-y-4">
        <div><label className="text-sm text-text-secondary">Name</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" defaultValue="User" /></div>
        <div><label className="text-sm text-text-secondary">Email</label><input className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary" defaultValue="user@email.com" disabled /></div>
        <div><label className="text-sm text-text-secondary">Bio</label><textarea className="w-full mt-1 rounded-lg border border-dark-500 bg-dark-800 px-3 py-2 text-sm text-text-primary h-24" placeholder="Tell us about yourself" /></div>
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium">Save Changes</button>
      </div>
    </div>
  )
}
