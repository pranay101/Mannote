'use client'

import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows'
import ReactFlow, { addEdge, Controls } from 'react-flow-renderer'
import Card from './Card/Card'
import { SetStateAction, useRef, useState } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import toast, { Toaster } from 'react-hot-toast'
import { cardsAtom } from '@/Config/RecoilConfig'
import { useRecoilState } from 'recoil'
import { generateUniqueId } from '../Utils/Utils'
import { CardProps } from '@/Config/typings'
type Props = {}

const Canvas = (props: Props) => {
    const [cards, setCards] = useRecoilState(cardsAtom)

    const addNewCardHandler = () => {
        if (cards.length >= 5) {
            const notify = () => toast('Max Card Limit Reached')
            notify()
            return
        }
        if (cards.length === 0) {
            const newCard: CardProps = {
                id: generateUniqueId(),
                x: 100,
                y: 100,
                cardTitle:"Card Title"
            }

            setCards([newCard])
            return
        }
        const lastCardWidth = cards[cards.length - 1].x || 100
        const lastCardHeight = cards[cards.length - 1].y || 100
        const windowWidth = window.innerWidth

        let widthToSet = 0
        let heightToSet = 0

        if (lastCardWidth + 450 > windowWidth) {
            widthToSet = 100
            heightToSet = lastCardHeight + 150
        } else {
            widthToSet = lastCardWidth + 350
            heightToSet = lastCardHeight
        }

        setCards((oldcards) => {
            return [
                ...oldcards,
                {
                    id: generateUniqueId(),
                    x: widthToSet,
                    y: heightToSet,
                    cardTitle:"Title..."
                },
            ]
        })
    }
    const closeCardHandler = (cardId: string) => {
        if (!cardId) {
            return
        }
        const newArrayOfCards = cards.filter((card) => card.id !== cardId)
        setCards(newArrayOfCards)
    }
    const updateCardContent = (cardId: string, content:string = '') => {
        if(!cardId){
            return
        }
        const index = cards.findIndex((card) => card.id === cardId)

        if (index !== -1) {
            const updatedCardList = [...cards]; 
            updatedCardList[index] = {
              ...updatedCardList[index], 
              content: content,
            };
            setCards(updatedCardList);
          }
        
    }

    console.log(cards);
    
    return (
        <div id="canvas" className="h-full w-full grid grid-cols-2]">
            <div className="w-20 h-full bg-gray-300 px-2 py-10 border-r-2 border-r-gray-300 shadow-lg fixed">
                <div className="w-12 h-12 shadow-md rounded-md mx-auto bg-gray-200 hover:bg-gray-100 cursor-pointer">
                    <PlusIcon onClick={addNewCardHandler} />
                </div>
                {/* sidebar */}
            </div>
            <div className="overflow-scroll flex justify-center align-middle w-[150vw]">
                {cards.map((card) => {
                    return (
                        <Card
                            cardTitle={card.cardTitle}
                            key={card.id}
                            id={card.id}
                            x={card.x}
                            y={card.y}
                            onCardCloseHandler={closeCardHandler}
                            updateCardContent={updateCardContent}
                        />
                    )
                })}
            </div>
            <Toaster />
        </div>
    )
}

export default Canvas
