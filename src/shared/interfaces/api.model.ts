import { FunctionsError, HttpsCallableResult } from "firebase/functions";
import { StuffLocation } from ".";

export enum GptVersion {
  THREE = 3,
  FOUR = 4,
}
export type CallableFn<T, K> = (
  data: T
) => Promise<HttpsCallableResult<K> | undefined>;
export type CallableHook<T, K> = [
  CallableFn<T, K>,
  boolean,
  FunctionsError | undefined
];

export interface BaseRequest {
  id: string;
  gpt: GptVersion;
}

export interface DurabiltityRequest extends BaseRequest {
  item: string;
  location: StuffLocation;
}

export interface EmojiRequest extends BaseRequest {
  item: string;
}

export interface DurabiltityResponse {
  response: {
    id: string;
    content: string;
    finish_reason: string;
    gpt: GptVersion;
  };
}
