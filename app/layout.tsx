'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className={inter.className}>
                        {children}
            </body>
        </html>
    )
}


// page
{/* <layout>page<layout> */}