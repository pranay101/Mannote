export interface GeneralObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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
  description: string;
  cards: Card[];
  edges?: Edge[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}
