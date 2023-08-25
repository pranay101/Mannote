'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Bars3Icon } from '@heroicons/react/24/outline'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "../ui/navigation-menu"
import { navigationMenuTriggerStyle } from "../ui/navigation-menu"


type Props = {}

const Navbar = (props: Props) => {
    return (
        <nav className='absolute h-36 top-0 left-0 w-screen px-5 md:px-20 text-black flex justify-between items-center z-10 overflow-x-hidden'>
            <Image className='' src={"/Mannotelogo.svg"} height={100} width={150} alt='logo' />

            <NavigationMenu className='hidden md:flex'>
                <NavigationMenuList className='text-sm uppercase font-normal text-black tracking-widest items-center'>
                    <NavigationMenuItem className='border-b-2 border-transparent hover:border-b-2 hover:border-gray-300 mx-5'>
                        <Link href={""}>Pricing</Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className='border-b-2 border-transparent hover:border-b-2 hover:border-gray-300 mx-5'>
                        <Link href={""}>About</Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <span className='flex items-center mx-5 px-5 py-1.5 rounded-[5px] font-semibold border-2 hover:bg-gray-900 hover:text-white'><Link href="">Login</Link></span>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>


            <div className='md:hidden'>
                  <Sheet>
                <SheetTrigger><Bars3Icon className='h-8 w-8 fill-black md:hidden' /></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
        
                    </SheetHeader>
                    <div className='h-full w-full flex justify-center items-center text-center'>
                        <ul>
                            <li className='my-10 text-base uppercase font-semibold text-black tracking-widest'><Link href={"#"}>Pricing</Link></li>
                            <li className='my-10 text-base uppercase font-semibold text-black tracking-widest'><Link href={"#"}>About</Link></li>
                            <li className='my-10 text-base uppercase font-semibold text-black tracking-widest'><Link href={"#"}>Login</Link></li>
                            <li className='my-10 text-base uppercase font-semibold text-black tracking-widest'><Link href={"#"}>Github</Link></li>
                        </ul>
                    </div>
                </SheetContent>
            </Sheet>
            </div>
          
        </nav>
    )
}

export default Navbar