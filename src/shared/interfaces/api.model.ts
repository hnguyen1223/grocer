import { HttpsCallableResult } from "firebase/functions";
import { StuffLocation } from ".";
import { FirestoreDataConverter, Timestamp } from "firebase/firestore";

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
  gpt: GptVersion;
  queryType: QueryType;
  query: T
}

export interface AIResponse {
  response: {
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

export interface BaseLog {
  queryType: QueryType;
  model: string;
  responseTime: number;
  timestamp: number
}

export interface GptLog extends BaseLog {
  tokens: number;
  finishReason: string;
}

export interface ObjectRecognitionLog extends BaseLog {
  objects: string[];
  fileSize: number;
}


export const RequestLogConverter: FirestoreDataConverter<BaseLog, any> = {
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return { ...data, timestamp: (data.timestamp as Timestamp).seconds } as BaseLog;
  },
  toFirestore: (_) => {
    throw new Error('Not implemented');
  }
}
