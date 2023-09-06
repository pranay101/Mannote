export interface CardProps {
    cardTitle:string,
    initialText?: string;
    id: string;
    x: number;
    y: number;
    content?:any
  }

  export interface Card{
    initialText?: string
    id: string
    x: number
    y: number,
    cardTitle:string,
    content?:any
}

export type DraggableData = {
    node: HTMLElement,
    x: number, y: number,
    deltaX: number, deltaY: number,
    lastX: number, lastY: number
  };

export type toolTip = {
    position: 'top' | 'bottom' | 'right' | 'left',
    title : string,
}

export type userSchema = {
    moodBoardTitle?: string,
}