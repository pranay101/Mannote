import '../globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body >
                <div className='relative w-screen h-screen overflow-x-hidden'>
                    {children}
                </div>
            </body>
        </html>
    )
}
