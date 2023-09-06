import { atom } from "recoil";
import { CardProps, userSchema } from "./typings";



const defaultCardList: CardProps[] = [];
const defaultUser: userSchema = {};
export const cardsAtom = atom({
    key: "cardList",
    default: defaultCardList,
});


export const userAtom = atom({
    key: "user",
    default: defaultUser,

})