'use client'
import { RecoilRoot } from 'recoil'
import '../globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
             <link rel="shortcut icon" href="/vercel.svg" type="image/x-icon" />
            </head>
            <body>
                <div className="relative w-screen h-screen overflow-x-hidden">
                    <RecoilRoot>{children}</RecoilRoot>
                </div>
            </body>
        </html>
    )
}
