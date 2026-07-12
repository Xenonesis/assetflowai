import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-[var(--surface-elevated)] rounded-full flex items-center justify-center mb-6 border border-[var(--border)]">
        <ShieldAlert className="w-8 h-8 text-[var(--text-secondary)]" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] mb-2">Page Not Found</h2>
      <p className="text-[var(--text-secondary)] mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  )
}
