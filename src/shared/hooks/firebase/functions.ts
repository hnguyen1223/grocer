import { useCallback, useState } from "react";
import {
  FunctionsError,
  HttpsCallable,
  httpsCallable,
} from "firebase/functions";
import { functions } from "../../../../firebase";
import { DataWithState } from "../../interfaces/data.model";
import { CallableFn } from "../../interfaces";

export default function useCallable<T, K>(
  name: string
): DataWithState<CallableFn<T, K>, FunctionsError, 'array', false> {
  const [error, setError] = useState<FunctionsError>();
  const [loading, setLoading] = useState<boolean>(false);

  const cachedFn = useCallback(async (data: T) => {
    const callable: HttpsCallable<T, K> = httpsCallable<T, K>(functions, name);
    setLoading(true);
    setError(undefined);
    try {
      return await callable(data);
    } catch (error) {
      setError(error as FunctionsError);
    } finally {
      setLoading(false);
    }
  }, []);

  return [cachedFn, loading, error];
}
