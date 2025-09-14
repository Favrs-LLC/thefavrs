import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TheFavrs - Creative Branded Events & Tech Solutions',
  description: 'We build creative branded events and tech solutions for the entertainment industry.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}