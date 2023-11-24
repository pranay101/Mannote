'use client'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Props = {}

const Login = () => {
    const router = useRouter()
    const {data:session} = useSession();

    useEffect(() =>{
        if(session){
            router.push("/Dashboard")
        }
    },[session])
    return (
        <main className="h-screen w-screen relative ">
            <nav className="bg-gray-100 h-16 w-full flex items-center px-10">
                <Button
                    onClick={() => router.push('/')}
                    startIcon={<ArrowBackIcon />}
                    className="text-gray-900"
                >
                    Home
                </Button>
            </nav>
            <section className="w-[90vw] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] h-[60vh] md:min-w-[400px] md:w-[25vw] bg-gray-100 shadow-md px-5 py-8">
                <h1 className="text-4xl text-center">Login</h1>
                <p className="text-xs p-2 text-gray-500 font-light text-center">
                    Current we support the following <br /> login poviders.
                </p>

                <button
                    className="flex items-center gap-4 bg-white p-4 hover:bg-gray-50 cursor-pointer mt-10 w-full"
                    onClick={() =>
                        signIn('google', {
                            redirect: true,
                            callbackUrl: '/',
                        })
                    }
                >
                    <Image
                        src={
                            'https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_1280.png'
                        }
                        width={20}
                        height={20}
                        alt="google"
                        className="h-10 w-10 aspect-square"
                    />
                    <span className="text-left">
                        <h2>Login with Google</h2>
                        <h4 className="text-sm">User</h4>
                    </span>
                </button>
                <button
                    className="flex items-center gap-4 bg-white p-4 hover:bg-gray-50 cursor-not-allowed mt-5 w-full"
                    disabled={true}
                >
                    <Image
                        src={
                            'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png'
                        }
                        width={20}
                        height={20}
                        alt="Github"
                        className="h-10 w-10 aspect-square"
                    />
                    <span className="text-left">
                        <h2>Login with Github</h2>
                        <h4 className="text-sm">User (disabled)</h4>
                    </span>
                </button>
            </section>
        </main>
    )
}

export default Login
