import { cardsAtom } from '@/Config/RecoilConfig'
import { CardProps } from '@/Config/typings'
import toast, { Toaster } from 'react-hot-toast'
import { useRecoilState } from 'recoil'
import { generateUniqueId } from '../Utils/Utils'
import Card from './Card/Card'

import AddIcon from '@mui/icons-material/Add'

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DrawingCard from './DrawingCard/DrawingCard'
import DrawIcon from '@mui/icons-material/Draw'
type Props = {}

const Canvas = (props: Props) => {
    const [cards, setCards] = useRecoilState(cardsAtom)

    const addNewCardHandler = (cardType: 'notes' | 'drawing') => {
        if (cards.length >= 5) {
            const notify = () => toast('Max Card Limit Reached')
            notify()
            return
        }
        if (cards.length === 0) {
            const newCard: CardProps = {
                id: generateUniqueId(),
                x: 50,
                y: 50,
                cardTitle: 'Card Title',
                cardType: cardType,
            }

            setCards([newCard])
            return
        }
        const lastCardWidth = cards[cards.length - 1].x
        const lastCardHeight = cards[cards.length - 1].y
        const windowWidth = window.innerWidth - 0.15 * window.innerWidth

        let widthToSet = 0
        let heightToSet = 0

        const newCardHeight =
            cards[cards.length - 1].cardType === 'notes' ? 150 : 450
        const newCardWidth =
            cards[cards.length - 1].cardType === 'notes' ? 350 : 450
        if (lastCardWidth + 300 > windowWidth) {
            widthToSet = 100
            heightToSet = lastCardHeight + newCardHeight
        } else {
            widthToSet = lastCardWidth + newCardWidth
            heightToSet = lastCardHeight
        }

        setCards((oldcards) => {
            return [
                ...oldcards,
                {
                    id: generateUniqueId(),
                    x: widthToSet,
                    y: heightToSet,
                    cardTitle: 'Title...',
                    cardType: cardType,
                },
            ]
        })
    }
    const clearAllCardsHandler = () => {
        setCards([])
    }

    return (
        <div id="canvas" className="h-full w-full flex justify-between">
            <div className="w-[5vw] min-w-[70px] h-full bg-gray-300 px-2 py-10 border-r-2 border-r-gray-300 shadow-lg space-y-5">
                <div className="tool">
                    <Tooltip placement="right" title="Add New Card">
                        <IconButton onClick={() => addNewCardHandler('notes')}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="tool">
                    <Tooltip placement="right" title="New Drawing Card">
                        <IconButton
                            onClick={() => addNewCardHandler('drawing')}
                        >
                            <DrawIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="tool">
                    <Tooltip placement="right" title="Clear All Cards">
                        <IconButton onClick={clearAllCardsHandler}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                {/* sidebar */}
            </div>
            <div className="overflow-scroll relative w-[95vw] h-[95vh]">
                {cards.map((card) => {
                    if (card.cardType === 'notes') {
                        return (
                            <Card
                                cardTitle={card.cardTitle}
                                key={card.id}
                                id={card.id}
                                x={card.x}
                                y={card.y}
                                content={card.content}
                            />
                        )
                    } else {
                        return (
                            <DrawingCard
                                cardTitle={card.cardTitle}
                                key={card.id}
                                id={card.id}
                                x={card.x}
                                y={card.y}
                                canvasData={card.canvasData}
                            />
                        )
                    }
                })}
            </div>
            <Toaster />
        </div>
    )
}

export default Canvas
