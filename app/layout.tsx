'use client'
import Navbar from '@/src/Navbar/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { RecoilRoot } from 'recoil'
import { usePathname } from 'next/navigation'

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
                    <RecoilRoot>
                {!['/Dashboard','/dashboard'].includes(path) && <Navbar />}
                        {children}
                    </RecoilRoot>
                </div>
            </body>
        </html>
    )
}


// page
{/* <layout>page<layout> */}