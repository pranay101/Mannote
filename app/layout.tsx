'use client'
import Navbar from '@/src/Navbar/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { RecoilRoot } from 'recoil'
import { usePathname } from 'next/navigation'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const path = usePathname()
    return (
        <html lang="en">
            <head>
                <title>Mannote - Your Goto Planner</title>
                <link rel="icon" href="favicon.ico" sizes="" />
            </head>
            <body className={inter.className}>
                <div className="relative w-screen h-screen overflow-x-hidden">
                    <SessionProvider>
                        <RecoilRoot>
                            {!['/Dashboard', '/dashboard','/Login','/login'].includes(path) && (
                                <Navbar />
                            )}
                            {children}
                            <Analytics />
                        </RecoilRoot>
                    </SessionProvider>
                </div>
            </body>
        </html>
    )
}

// page
{
    /* <layout>page<layout> */
}
