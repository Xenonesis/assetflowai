'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-[var(--danger)]/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-[var(--danger)]" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] mb-2">Something went wrong!</h2>
      <p className="text-[var(--text-secondary)] mb-8 max-w-md">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={() => reset()}
          className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
        >
          Try again
        </Button>
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
          className="border-[var(--border)] text-[var(--text-primary)]"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
