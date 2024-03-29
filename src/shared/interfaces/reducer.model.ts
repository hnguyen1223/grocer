import { Reducer } from "react";
import { Stuff } from ".";

export enum STUFF_ACTION_TYPE {
  ADD = "add",
  UPDATE = "update",
  DELETE = "delete",
}
export interface StuffAction {
  type: STUFF_ACTION_TYPE;
  stuff: Partial<Stuff> & Pick<Stuff, "id">;
}
export type StuffsReducer = Reducer<Stuff[], StuffAction>;
