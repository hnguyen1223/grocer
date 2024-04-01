import { HttpsCallableResult } from "firebase/functions";
import { StuffLocation } from ".";

export enum GptVersion {
  THREE = 3,
  FOUR = 4,
}
export type CallableFn<T, K> = (
  data: T
) => Promise<HttpsCallableResult<K> | undefined>;

export interface BaseRequest {
  id: string;
  item: string;
  gpt: GptVersion;
}

export interface DurabiltityRequest extends BaseRequest {
  location: StuffLocation;
}

export interface DurabiltityResponse {
  response: {
    id: string;
    content: string;
    finish_reason: string;
    gpt: GptVersion;
  };
}
