import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}
