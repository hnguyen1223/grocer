import { FirestoreError } from "firebase/firestore";
import { useContext } from "react";
import { useLiveDb } from ".";
import { UserContext } from "../../core/UserProvider";
import { StuffsContext } from "../../core/StuffsProvider";
import { BaseLog, ChartElement, DataGrouping, LOG_GROUPINGS, RequestLogConverter, Stuff, STUFF_CATEGORY_GROUPINGS } from "../interfaces";


export function useWeeklyUsage(): { weeklyUsage: number, error: FirestoreError | undefined } {
    const user = useContext(UserContext);
    const [userData, _, userDataError] = useLiveDb<any>(`users/${user?.uid}`);
    return { weeklyUsage: userData?.weeklyLimit ?? 0, error: userDataError };
}

export function useUsageStats(): { modelUsage: ChartElement<BaseLog>[][], error: FirestoreError | undefined } {
    const user = useContext(UserContext);
    const [userRequests, _, requestsError] = useLiveDb<BaseLog[]>(`users/${user?.uid}/requests`, RequestLogConverter);
    const modelUsage = getStats(userRequests ?? [], LOG_GROUPINGS);
    return { modelUsage, error: requestsError };
}

export function useItemStats(): ChartElement<Stuff>[][] {
    const allStuffs = useContext(StuffsContext);
    return getStats(allStuffs, STUFF_CATEGORY_GROUPINGS);
}

function groupElement<T>(
    array: T[],
    grouping: DataGrouping<T>
): ChartElement<T>[] {
    return Object.values(
        array.reduce((acc: { [key: string]: ChartElement<T> }, item) => {
            const label = grouping.groupFn(item);
            acc[label] = acc[label] || {
                data: [],
                count: 0,
                label,
                group: grouping.name,
            };
            acc[label].data.push(item);
            acc[label].count++;
            return acc;
        }, {})
    );
}

function getStats<T>(items: T[], groupings: DataGrouping<T>[]): ChartElement<T>[][] {
    return groupings.reduce(
        (data: ChartElement<T>[][], grouping, index) => {
            const currentGroupData = (
                data[index - 1] ?? [{ data: items }]
            ).flatMap((element) => groupElement(element.data, grouping));
            data.push(currentGroupData);
            return data;
        },
        []
    );
}