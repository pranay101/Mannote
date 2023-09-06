'use client'
import Canvas from '@/src/Canvas/Canvas'
import { useEffect, useState } from 'react'
import { cardsAtom } from '@/Config/RecoilConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { CardProps } from '@/Config/typings'
type Props = {}

const page = (props: Props) => {
    const [cards, setCards] = useRecoilState(cardsAtom);  
    const [lastSaveTime, setLastSaveTime] = useState("")
    
    const saveDataToLocalStorage = (data:CardProps[]) => {
        const currentTime = new Date().toLocaleTimeString();
        localStorage.setItem('cardData', JSON.stringify(data));
        localStorage.setItem('lastSaveTime', currentTime);
        return currentTime;
      }

    useEffect(() => {
        // Save data to local storage every 10 seconds
        const saveInterval = setInterval(() => {
            console.log("Saving...");
            const currentTime = saveDataToLocalStorage(cards)
            setLastSaveTime(currentTime)
        }, 10000)
        return () => {
            clearInterval(saveInterval)
        }
    }, [cards])

    useEffect(() => {
        // Get data from local storage
        const savedData = localStorage.getItem('cardData');
        const lastSavedTimeLocal = localStorage.getItem('lastSaveTime') || "";
        if (savedData) {
          const parsedData = JSON.parse(savedData);          
          setCards(parsedData);
        }
        setLastSaveTime(lastSavedTimeLocal)
      }, [setCards]);

    return (
        <main className="h-screen w-screen bg-gray-100 grid overflow-hidden relative">
            <section className="w-full h-[10vh] bg-gray-800 flex justify-center items-center">
                <h1
                    contentEditable
                    suppressContentEditableWarning
                    className="text-white text-lg focus:outline-none focus:border-b focus:border-b-gray-400 w-fit mx-auto"
                >
                    Mood Board Title
                </h1>
                <p title='Saves Every minute' className='absolute top-5 right-3 text-gray-50 text-sm'>Last Saved: {lastSaveTime}</p>
            </section>
            <section className="flex h-[90vh] w-full overflow-hidden">
                <Canvas />
            </section>
        </main>
    )
}

export default page;
