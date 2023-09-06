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
             <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
             <title>DashBoard</title>
            </head>
            <body>
                <div className="relative w-screen h-screen overflow-x-hidden">
                    <RecoilRoot>{children}</RecoilRoot>
                </div>
            </body>
        </html>
    )
}
