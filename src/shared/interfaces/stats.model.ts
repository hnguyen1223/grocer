import { DocumentData, FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { QueryType, StuffLocation } from ".";

export type RequestType = StuffLocation | QueryType.CATEGORY | QueryType.EMOJI | QueryType.OBJECT;

export type Logs<T> = {
    [key in RequestType]?: T
} & DocumentData

export interface RequestLog {
    completionTokens: number;
    promptTokens: number;
    totalTokens: number;
    model: string;
    finishReason: string;
    timestamp: number;
    responseTime: number;
}
interface DbRequestLog {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
    model: string;
    finish_reason: string;
    timestamp: Timestamp;
    responseTime: number;
}

export interface ModelUsage {
    model: string;
    count: number;
    tokens: number
}

export const RequestLogConverter: FirestoreDataConverter<Logs<RequestLog>, Logs<DbRequestLog>> = {
    fromFirestore: (snapshot) => {
        const data = snapshot.data();
        return Object.keys(data).filter(key => key !== 'id').reduce((acc: Logs<RequestLog>, key) => {
            acc[key as RequestType] = {
                completionTokens: data[key].completion_tokens,
                promptTokens: data[key].prompt_tokens,
                totalTokens: data[key].total_tokens,
                model: data[key].model,
                finishReason: data[key].finish_reason,
                timestamp: (data[key].timestamp as Timestamp).seconds,
                responseTime: data[key].response_time
            }
            return acc
        }, {})
    },
    toFirestore: (_) => {
        throw new Error('Not implemented');
    }
}