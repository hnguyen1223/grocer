import { DocumentData } from "firebase/firestore";

export enum StuffLocation {
  FREEZER = "freezer",
  FRIDGE = "fridge",
  OUTSIDE = "outside",
}
export interface Durability {
  hours: number;
  days: number;
  isRecommended: boolean;
  description: string;
}

export type Durabilities = Record<StuffLocation, Durability | undefined>;

export interface Stuff extends DocumentData {
  emoji: string;
  id: string;
  dateAdded: string;
  name: string;
  location: StuffLocation;
  expiryDate?: string;
  durabilities: Durabilities;
}
