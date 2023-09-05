import { atom } from "recoil";
import { CardProps } from "./typings";



const defaultCardList: CardProps[] = [];

export const cardsAtom = atom({
  key: "cardList",
  default: defaultCardList,
});

