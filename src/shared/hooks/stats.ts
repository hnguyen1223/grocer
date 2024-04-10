import { FirestoreError } from "firebase/firestore";
import { useContext } from "react";
import { useLiveDb } from ".";
import { UserContext } from "../../core/UserProvider";
import { StuffsContext } from "../../core/StuffsProvider";
import {
  BaseLog,
  ChartElement,
  getStats,
  LOG_GROUPINGS,
  RequestLogConverter,
  Stuff,
  STUFF_CATEGORY_GROUPINGS,
} from "../interfaces";

export function useWeeklyUsage(): {
  weeklyUsage: number;
  error: FirestoreError | undefined;
} {
  const user = useContext(UserContext);
  const [userData, _, userDataError] = useLiveDb<any>(`users/${user?.uid}`);
  return { weeklyUsage: userData?.weeklyUsage ?? 0, error: userDataError };
}

export function useUsageStats(): {
  modelUsage: ChartElement<BaseLog>[][];
  error: FirestoreError | undefined;
} {
  const user = useContext(UserContext);
  const [userRequests, _, requestsError] = useLiveDb<BaseLog[]>(
    `users/${user?.uid}/requests`,
    RequestLogConverter
  );
  const modelUsage = getStats(userRequests ?? [], LOG_GROUPINGS);
  return { modelUsage, error: requestsError };
}

export function useItemStats(): ChartElement<Stuff>[][] {
  const allStuffs = useContext(StuffsContext);
  return getStats(allStuffs, STUFF_CATEGORY_GROUPINGS);
}
