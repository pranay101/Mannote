'use client'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


type Props = {}

const Navbar = (props: Props) => {
    const [openMenu, setOpenMenu] = useState(false)
    const router = useRouter()
    return (
        <>
            <nav className="absolute h-36 top-0 left-0 w-screen px-5 md:px-20 text-black flex justify-between items-center z-50 overflow-hidden">
                <Image
                    onClick={() => router.push('/')}
                    className="cursor-pointer"
                    src={'/MannoteLogo.png'}
                    height={50}
                    width={100}
                    alt="logo"
                />
                <div className="hidden md:flex text-sm uppercase font-normal text-black tracking-widest items-center">
                    <Link
                        className="border-b-2 border-transparent hover:border-b-2 hover:border-gray-300 mx-5"
                        href={''}
                    >
                        Pricing
                    </Link>
                    <Link
                        className="border-b-2 border-transparent hover:border-b-2 hover:border-gray-300 mx-5"
                        href={''}
                    >
                        About
                    </Link>
                    <Link
                        className="border-b-2 border-transparent hover:border-b-2 hover:border-gray-300 mx-5"
                        href={'/dashboard'}
                    >
                        Dashboard
                    </Link>
                    <Link href="/Login">
                        <span className="flex items-center mx-5 px-5 py-1.5 rounded-[5px] font-semibold border-2 hover:bg-gray-900 hover:text-white">
                            Login
                        </span>
                    </Link>
                </div>

                <Bars3Icon
                    onClick={() => setOpenMenu(true)}
                    className="md:hidden h-10 w-10 fill-gray-900"
                />
            </nav>
            <div
                className={`md:hidden absolute h-screen w-screen bg-gray-50 z-50  ease-out duration-500 ${
                    !openMenu ? 'translate-x-[100%]' : 'translate-x-0'
                }`}
            >
                <XMarkIcon
                    onClick={() => setOpenMenu(false)}
                    className="h-10 w-10 fill-gray-900 absolute top-10 right-5 z-50 "
                />

                <div className="h-full w-full flex items-center justify-center flex-col">
                    <Link
                        className="border-b-2 text-lg border-transparent hover:border-b-2 hover:border-gray-300 my-5"
                        href={''}
                    >
                        Pricing
                    </Link>
                    <Link
                        className="border-b-2 text-lg border-transparent hover:border-b-2 hover:border-gray-300 my-5"
                        href={''}
                    >
                        About
                    </Link>
                    <Link
                        className="border-b-2 text-lg border-transparent hover:border-b-2 hover:border-gray-300 my-5"
                        href={'/dashboard'}
                    >
                        Dashboard
                    </Link>
                    <Link
                        className="border-b-2 text-lg border-transparent hover:border-b-2 hover:border-gray-300 my-5"
                        href={''}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Navbar
