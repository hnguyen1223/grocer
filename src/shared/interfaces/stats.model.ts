import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { QueryType } from ".";

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

export interface ModelUsage {
    model: string;
    count: number;
    tokens: number
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
