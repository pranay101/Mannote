import { v4 as uuidv4 } from "uuid";

export interface Card {
  id: string;
  title: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  cards: Card[];
  edges?: Edge[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export function createNewBoard(
  title: string,
  userId: string,
  description: string = ""
): Board {
  return {
    id: uuidv4(),
    title,
    description,
    cards: [],
    edges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
  };
}

export function createNewCard(
  title: string,
  content: string = "",
  position = { x: 0, y: 0 }
): Card {
  return {
    id: uuidv4(),
    title,
    content,
    position,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
