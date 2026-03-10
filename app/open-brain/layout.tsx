import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open Brain — Agent Orchestration',
  description: 'Multi-agent orchestration platform for the MTR Design System',
}

export default function OpenBrainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      {children}
    </div>
  )
}
