import { HttpsCallableResult } from "firebase/functions";
import { StuffLocation } from ".";

export enum GptVersion {
  THREE = '3.5',
  FOUR = '4',
}

export enum QueryType {
  DURABILITY = "durability",
  EMOJI = "emoji",
  CATEGORY = "category",
  OBJECT = "object",
}

export type CallableFn<T, K> = (
  data: T
) => Promise<HttpsCallableResult<K> | undefined>;

export interface AIRequest<T extends BaseQuery> {
  id: string;
  gpt: GptVersion;
  queryType: QueryType;
  query: T
}

export interface AIResponse {
  response: {
    id: string;
    content: string;
    finish_reason: string;
    model: string;
  };
}

export interface BaseQuery {
  item: string;
}

export interface DurabiltityQuery extends BaseQuery {
  stuffLocation: StuffLocation;
}

