import { Reducer } from "react";
import { Stuff } from ".";

export enum StuffActionType {
  ADD = "add",
  UPDATE = "update",
  DELETE = "delete",
}
export interface StuffAction {
  type: StuffActionType;
  stuff: Partial<Stuff> & Pick<Stuff, "id">;
}
export type StuffsReducer = Reducer<Stuff[], StuffAction>;
