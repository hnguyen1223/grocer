import { useCallback, useState } from "react";
import {
  FunctionsError,
  HttpsCallable,
  httpsCallable,
} from "firebase/functions";
import { CallableHook } from "../../interfaces/api.model";
import { functions } from "../../../../firebase";

export default function useCallable<T, K>(name: string): CallableHook<T, K> {
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
