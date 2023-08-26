import Navbar from '@/components/Navbar/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mannote - Your Goto Planner',
  description: 'Notes app revolutionized',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={inter.className}>
            <Navbar />
            <div className={"h-screen w-screen overflow-x-hidden"}>
                {children}
            </div>
        </body>
    </html>
  )
}
