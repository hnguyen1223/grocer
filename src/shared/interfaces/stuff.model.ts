import { DocumentData } from "firebase/firestore";

export enum StuffLocation {
  FREEZER = "freezer",
  FRIDGE = "fridge",
  OUTSIDE = "outside",
}

export enum StuffView {
  LOCATION = "Location",
  EXPIRY = "Expiry",
  CATEGORY = "Category",
}

export interface Durability {
  hours: number;
  days: number;
  isRecommended: boolean;
  description: string;
}

export enum StuffStatus {
  FINISHED = "Finished",
  SPOILED = "Spoiled",
}

export type Durabilities = Record<StuffLocation, Durability | undefined>;

export interface Stuff extends DocumentData {
  id: string;
  emoji: string;
  category: string;
  dateAdded: string;
  name: string;
  location: StuffLocation;
  expiryDate?: string;
  durabilities: Durabilities;
  status?: StuffStatus;
}
