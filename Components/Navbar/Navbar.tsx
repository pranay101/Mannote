import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className='sticky h-36 top-0 left-0 w-full px-20 text-black flex justify-between items-center z-10'>
        <Image src={"/Mannotelogo.svg"} height={100} width={200} alt='logo'/>
        <ul className='flex text-sm uppercase font-normal text-black tracking-widest items-center'>
            <li className='border-b-2 border-transparent hover:border-b-2 hover:border-gray-300 mx-5'><Link href="">Pricing</Link></li>
            <li className='border-b-2 border-transparent hover:border-b-2 hover:border-gray-300 mx-5'><Link href="">About</Link></li>
            <li className='flex items-center mx-auto px-5 py-1.5 rounded-[5px] font-semibold border-2 hover:bg-gray-900 hover:text-white'><Link href="">Login</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar