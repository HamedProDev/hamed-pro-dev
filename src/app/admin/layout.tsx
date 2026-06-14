import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Navbar } from '@/components/layout/Navbar'
import { AdminAuthProvider, AdminGate } from '@/components/admin/AdminGate'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGate>
        <div className="min-h-screen bg-surface-primary">
          <Navbar />
          <div className="flex pt-16">
            <AdminSidebar />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </AdminGate>
    </AdminAuthProvider>
  )
}
