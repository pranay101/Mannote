'use client'

import * as React from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas'
import CloseIcon from '@mui/icons-material/Close'
import ControlCameraIcon from '@mui/icons-material/ControlCamera'
import { IconButton } from '@mui/material'
import { useRecoilState } from 'recoil'
import { cardsAtom } from '@/Config/RecoilConfig'
import { DraggableData, CanvasPath } from '@/Config/typings'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import DownloadIcon from '@mui/icons-material/Download'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
const styles = {
    width: '400px',
    height: '400px',
}
type DrawingCardProp = {
    id: string
    x: number
    y: number
    cardTitle: string
    canvasData: any
}
const DrawingCard = (props: DrawingCardProp) => {
    const [cards, setCards] = useRecoilState(cardsAtom)
    // const drawingBoardRef: React.Ref<ReactSketchCanvasRef> = React.useRef(null);
    const drawingBoardRef = React.useRef<ReactSketchCanvasRef | null>(null);
    const updateBoard = React.useRef(false)
    const [canvasData, setCanvasData] = React.useState<CanvasPath>()
    const [imageDataUrl, setImageDataUrl] = React.useState('')
    const updateCardPosition: DraggableEventHandler = (
        e,
        data: DraggableData
    ) => {
        const index = cards.findIndex((card) => card.id === props.id)
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

    const updateCanvasData = (canvasPath: any) => {
        const cardId: string = props.id
        if (!cardId) {
            return
        }
        const index = cards.findIndex((card) => card.id === cardId)

        if (index !== -1) {
            const updatedCardList = [...cards]

            updatedCardList[index] = {
                ...updatedCardList[index],
                canvasData: canvasPath,
            }
            setCanvasData(canvasPath)
            setCards(updatedCardList)
        }
    }

    function exportSketchToBase64(): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            if(drawingBoardRef && drawingBoardRef?.current){
                let base64DataUrl = drawingBoardRef?.current.exportImage('jpeg')
                if (base64DataUrl) {
                    resolve(base64DataUrl)
                } else {
                    reject(new Error('Failed to export sketch as base64 data URL'))
                }
                
            }

        })
    }

    const handleDownload = async () => {
        try {
            if (drawingBoardRef.current) {
                const base64DataUrl = await exportSketchToBase64()
                setImageDataUrl(base64DataUrl)
                const a = document.createElement('a')
                a.href = base64DataUrl
                a.download = 'card.jpeg'
                a.click()
            }
        } catch (error) {
            console.error('Error exporting or downloading sketch:', error)
        }
    }

    React.useEffect(() => {
        if (
            drawingBoardRef.current &&
            props.canvasData &&
            !updateBoard.current
        ) {
            drawingBoardRef.current.loadPaths(props.canvasData)
            updateBoard.current = true
        }
    }, [props.canvasData])
    return (
        <Draggable
            // defaultPosition={{ x: x, y: y }}
            position={{ x: props.x, y: props.y }}
            handle=".drag-handle"
            onDrag={updateCardPosition}
            bounds={{ left: 5, top: 5 }}
        >
            <main className="w-[400] border-gray-100 absolute bg-white">
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
                            updateCard(
                                props.id,
                                'cardTitle',
                                e.target.innerText
                            )
                        }
                    >
                        {props.cardTitle}
                    </div>
                    <div className="inline-flex gap-3">
                        <IconButton onClick={() => closeCardHandler(props.id)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                {/* toolbar */}
                <div className="flex bg-gray-50 space-x-2 justify-center items-center border-b-2 border-b-gray-300">
                    <span className="border-gray-100 p-1">
                        <IconButton size="small">
                            <CleaningServicesIcon
                                onClick={() =>
                                    drawingBoardRef.current?.clearCanvas()
                                }
                            />
                        </IconButton>
                    </span>
                    <span className="border-gray-100 p-1">
                        <IconButton size="small">
                            <DownloadIcon onClick={handleDownload} />
                        </IconButton>
                    </span>
                    <span className="border-gray-100 p-1">
                        <IconButton size="small">
                            <UndoIcon
                                onClick={() => drawingBoardRef.current?.undo()}
                            />
                        </IconButton>
                    </span>
                    <span className="border-gray-100 p-1">
                        <IconButton
                            size="small"
                            onClick={() => drawingBoardRef.current?.redo()}
                        >
                            <RedoIcon />
                        </IconButton>
                    </span>
                    <span className="border-gray-100 p-1">
                        <IconButton size="small">
                            <CheckBoxOutlineBlankIcon
                                onClick={() =>
                                    drawingBoardRef.current?.eraseMode(true)
                                }
                            />
                        </IconButton>
                    </span>
                </div>

                <ReactSketchCanvas
                    ref={drawingBoardRef}
                    onChange={updateCanvasData}
                    className="h-[400px]"
                    style={styles}
                    strokeWidth={4}
                    strokeColor="red"
                />
            </main>
        </Draggable>
    )
}

export default DrawingCard
