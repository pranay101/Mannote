'use client'
import Navbar from '@/src/Navbar/Navbar'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { RecoilRoot } from 'recoil'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <title>Mannote - Your Goto Planner</title>
                <link rel="icon" href="favicon.ico" sizes="" />
            </head>
            <body className={inter.className}>
                <div className="relative w-screen h-screen overflow-x-hidden">
                    <RecoilRoot>
                        <Navbar />
                        {children}
                    </RecoilRoot>
                </div>
            </body>
        </html>
    )
}


// page
{/* <layout>page<layout> */}