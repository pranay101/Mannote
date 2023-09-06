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
                x: 50,
                y: 50,
                cardTitle: 'Card Title',
            }

            setCards([newCard])
            return
        }
        const lastCardWidth = cards[cards.length - 1].x
        const lastCardHeight = cards[cards.length - 1].y
        const windowWidth = window.innerWidth - 0.15 * window.innerWidth

        let widthToSet = 0
        let heightToSet = 0

        if (lastCardWidth + 300 > windowWidth) {
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
                    cardTitle: 'Title...',
                },
            ]
        })
    }
    const clearAllCardsHandler = () => {
        setCards([])
    }
    return (
        <div id="canvas" className="h-full w-full flex justify-between">
            <div className="w-[5vw] h-full bg-gray-300 px-2 py-10 border-r-2 border-r-gray-300 shadow-lg space-y-5">
                <div className="tool">
                <Tooltip placement='right' title="Add New Card">
                        <IconButton onClick={addNewCardHandler}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="tool">
                    <Tooltip placement='right' title="Clear All Cards">
                        <IconButton onClick={clearAllCardsHandler}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                {/* sidebar */}
            </div>
            <div className="overflow-scroll relative w-[95vw] h-[95vh]">
                {cards.map((card) => {
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
                })}
            </div>
            <Toaster />
        </div>
    )
}

export default Canvas
