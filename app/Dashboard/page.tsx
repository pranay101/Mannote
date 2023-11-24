'use client'
import Canvas from '@/src/Canvas/Canvas'
import { useEffect, useLayoutEffect, useState } from 'react'
import { cardsAtom, userAtom } from '@/Config/RecoilConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { CardProps } from '@/Config/typings'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import toast, { Toaster } from 'react-hot-toast'

type Props = {}

const page = (props: Props) => {
    const [cards, setCards] = useRecoilState(cardsAtom)
    const [user, setUser] = useRecoilState(userAtom)
    const [lastSaveTime, setLastSaveTime] = useState('Never')
    const { data: session } = useSession()
    const [showLoader, setShowLoder] = useState(true)
    const router = useRouter()

    const saveDataToLocalStorage = (data: CardProps[]) => {
        const currentTime = new Date().toLocaleTimeString()
        localStorage.setItem('cardData', JSON.stringify(data))
        localStorage.setItem('lastSaveTime', currentTime)
        return currentTime
    }

    const updateBoardTitle = (boardTitle: string) => {
        localStorage.setItem('boardTitle', boardTitle)
    }

    useEffect(() => {
        if (!session) {
            const notify = () => toast('Session Expired. You need to Login')
            notify()
            setTimeout(() => router.replace('/'),2000)            
        } else {
            setShowLoder(false)
        }
    }, [])

    useEffect(() => {
        // Save data to local storage every 10 seconds
        const saveInterval = setInterval(() => {
            console.log('Saving...')
            const currentTime = saveDataToLocalStorage(cards)
            setLastSaveTime(currentTime)
        }, 10000)
        return () => {
            clearInterval(saveInterval)
        }
    }, [cards])

    useEffect(() => {
        // Get data from local storage
        const savedData = localStorage.getItem('cardData')
        const lastSavedTimeLocal = localStorage.getItem('lastSaveTime') || ''
        const boardTitle = localStorage.getItem('boardTitle') || ''
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            setCards(parsedData)
        }
        setUser((userDetails) => {
            return {
                ...userDetails,
                moodBoardTitle: boardTitle,
            }
        })
        setLastSaveTime(lastSavedTimeLocal)
    }, [setCards])

    return (
        <main className="h-screen w-screen bg-gray-100 grid overflow-hidden relative">
            {showLoader ? (
                <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <section className="w-full h-[10vh] bg-gray-800 flex justify-between items-center px-5">
                        <Button
                            onClick={() => router.push('/')}
                            variant="text"
                            color="info"
                            startIcon={<ArrowBackIcon />}
                            className="text-white"
                        >
                            Home
                        </Button>
                        <h1
                            contentEditable
                            suppressContentEditableWarning
                            className="text-white text-lg focus:outline-none focus:border-b focus:border-b-gray-400 w-fit mx-auto"
                            onBlur={(e) => updateBoardTitle(e.target.innerText)}
                        >
                            {user.moodBoardTitle?.length
                                ? user.moodBoardTitle
                                : 'Mood Board Title'}
                        </h1>
                        <p
                            title="Saves Every minute"
                            className="text-gray-50 text-sm"
                        >
                            Last Saved: {lastSaveTime}
                        </p>
                    </section>
                    <section className="flex h-[90vh] w-full overflow-hidden">
                        <Canvas />
                    </section>
                </>
            )}
            <Toaster />
        </main>
    )
}

export default page
