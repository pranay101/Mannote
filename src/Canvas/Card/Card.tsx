'use client'
import { cardsAtom } from '@/Config/RecoilConfig'
import { Card, DraggableData } from '@/Config/typings'
import {} from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import 'react-quill/dist/quill.snow.css'
import { useRecoilState } from 'recoil'

import CloseIcon from '@mui/icons-material/Close'
import ControlCameraIcon from '@mui/icons-material/ControlCamera'
import { IconButton } from '@mui/material'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
const Card: React.FC<Card> = ({
    initialText = 'Start Writing...',
    id,
    x,
    y,
    cardTitle,
    content,
}) => {
    const [markdownText, setMarkdownText] = useState<string>(content)
    const [cards, setCards] = useRecoilState(cardsAtom)

    const updateCardPosition: DraggableEventHandler = (
        e,
        data: DraggableData
    ) => {
        const index = cards.findIndex((card) => card.id === id)
        const xCordinate = data.x
        const yCordinate = data.y
        if (index !== -1) {
            const updatedCardList = [...cards]
            updatedCardList[index] = {
                ...updatedCardList[index],
                x: xCordinate,
                y: yCordinate,
            }
            setCards(updatedCardList)
        }
    }
    const closeCardHandler = (cardId: string) => {
        if (!cardId) {
            return
        }
        const newArrayOfCards = cards.filter((card) => card.id !== cardId)
        setCards(newArrayOfCards)
    }
    const updateCard = (
        cardId: string,
        field: 'cardTitle' | 'content',
        content: string = ''
    ) => {
        if (!cardId) {
            return
        }
        const index = cards.findIndex((card) => card.id === cardId)

        if (index !== -1) {
            const updatedCardList = [...cards]
            if (field === 'cardTitle') {
                updatedCardList[index] = {
                    ...updatedCardList[index],
                    cardTitle: content,
                }
            }
            if (field === 'content') {
                updatedCardList[index] = {
                    ...updatedCardList[index],
                    content: content,
                }
            }
            setCards(updatedCardList)
        }
    }
    useEffect(() => {
        updateCard(id, 'content', markdownText)
    }, [markdownText])

    return (
        <Draggable
            // defaultPosition={{ x: x, y: y }}
            position={{ x: x, y: y }}
            handle=".drag-handle"
            onDrag={updateCardPosition}
            bounds={{left:5}}
        >
            <div id={id} className="bg-white rounded-sm h-fit absolute">
                <div className="flex justify-between items-center h-10 font-medium text-sm px-2 py-2 text-gray-500 bg-gray-200">
                    <ControlCameraIcon className="h-6 w-6 cursor-move drag-handle" />
                    <div
                        className="flex items-center focus:outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                        onBlur={(e) =>
                            updateCard(id, 'cardTitle', e.target.innerHTML)
                        }
                    >
                        {cardTitle}
                    </div>
                    <div className="inline-flex gap-3">
                        <IconButton onClick={() => closeCardHandler(id)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>

                <div>
                    <ReactQuill
                        id="card"
                        style={{
                            background: 'white',
                            padding: '0px',
                            minHeight: '100px',
                            height: 'fitContent',
                            width: '300px',
                            overflow: 'auto',
                            border: 'none',
                            outline: 'none',
                        }}
                        className="text-sm font-serif font-medium"
                        value={markdownText}
                        onChange={setMarkdownText}
                        modules={{ toolbar: false }}
                    />
                </div>
            </div>
        </Draggable>
    )
}

export default Card
