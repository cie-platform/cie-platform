import './globals.css'
import type { Metadata } from 'next'
import AppShell from './AppShell'

export const metadata: Metadata = {
  title: 'Sistema CIE | Control Central',
  description: 'Plataforma académica premium',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-transparent text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}