export interface CardProps {
    cardTitle:string,
    initialText?: string;
    id: any;
    x: number;
    y: number;
    content?:any
  }

  export interface Card{
    initialText?: string
    id: any
    x: number
    y: number,
    onCardCloseHandler:Function,
    updateCardContent:Function,
    cardTitle:string,
}