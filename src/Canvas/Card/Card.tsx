import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactQuill from 'react-quill'
import Draggable from 'react-draggable'
import 'react-quill/dist/quill.snow.css'
import {  } from '@heroicons/react/24/outline'
import { ArrowsRightLeftIcon,XMarkIcon } from '@heroicons/react/20/solid'
import { Card } from '@/Config/typings'

const Card: React.FC<Card> = ({
    initialText = 'Start Writing...',
    id,
    x,
    y,
    onCardCloseHandler,
    updateCardContent
}) => {
    const [markdownText, setMarkdownText] = useState<string>(initialText)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        setIsDragging(true)
        const cardRect = e.currentTarget.parentElement?.getBoundingClientRect()
        if (cardRect) {
            setDragOffset({
                x: e.clientX - cardRect.left,
                y: e.clientY - cardRect.top,
            })
        }
    }

    
    useEffect(() => {
        const handleMouseUp = () => {
            setIsDragging(false)
        }
    
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const card = document.getElementById(id)
                if (card) {
                    card.style.top = e.clientY - dragOffset.y + 'px'
                    card.style.left = e.clientX - dragOffset.x + 'px'
                }
            }
        }
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        } else {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    // Update the recoil atom whenever the content changes
    useEffect(() => {
        updateCardContent(id,markdownText)
    }, [markdownText])

    return (
        <Draggable disabled>
            <div
                style={{ position: 'absolute', top: y, left: x }}
                id={id}
                className="bg-white rounded-sm"
            >
                <div className="flex justify-between items-center h-10 font-medium text-sm px-5 py-2 text-gray-500 bg-gray-200">
                    <ArrowsRightLeftIcon
                        title="Hold to Drag"
                        onMouseDown={handleMouseDown}
                        className="h-6 w-6 cursor-move drag-handle"
                    />
                    <div
                        className="flex items-center focus:outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                    >
                        Card Title
                    </div>
                    <div className="inline-flex gap-3">
                        <XMarkIcon
                            onClick={() => onCardCloseHandler(id)}
                            title="Hold to Drag"
                            className="h-6 w-6 cursor-pointer"
                        />
                        {/* <XMarkIcon title='Close card'/> */}
                    </div>
                </div>

                <div>
                    <ReactQuill
                        id="card"
                        style={{
                            background: 'white',
                            padding: '0px',
                            minHeight: '100px',
                            height: 'auto',
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
