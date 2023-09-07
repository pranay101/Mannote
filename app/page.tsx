
import { ArrowSmallRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export default function Home() {
  return (
   <main className='h-full w-screen bg-white text-black relative'>
        <div className='text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
        <span className='px-3 text-8xl font-bold text-gray-900 md:whitespace-nowrap'>Mann-Note</span>
        <p className='text-gray-500 text-base tracking-wider mt-3'>"Empower Your Productivity: Where Notes and Plans Unite!"</p>
        <span className='w-full text-center'>
            <button className='flex items-center text-lg mx-auto mt-8 px-5 py-1 rounded-lg font-semibold border-2 hover:bg-gray-900 hover:text-white'>Get Started 
            <ArrowSmallRightIcon className='h-10' /> </button>
        </span>
        </div>
        {/* <Image className='absolute bottom-0 left-10 opacity-50' src={"/background.svg"}height={500} width={500} alt='productivity' /> */}
        <div className='border-t h-20 w-full absolute bottom-0 left-0 flex justify-between text-sm text-gray-500 items-center px-8 md:px-24'>
            <span>
                <Link href={"/Feeback"}>Share Feedback</Link>
            </span>
            <p>All rights Reserved</p>
                <Link href={"https://github.com/pranay101/Mannote"}>Github</Link>          
        </div>    
   </main>
  )
}
