import { Dispatch, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Durability,
  StuffActionType,
  Stuff,
  StuffAction,
  StuffLocation,
} from "../interfaces";
import {
  AIResponse,
  GptVersion,
  AIRequest,
  DurabiltityQuery,
  BaseQuery,
  QueryType,
} from "../interfaces/api.model";
import useCallable from "./firebase/functions";
import { v4 as uuidv4 } from "uuid";
import { UserContext, UserInitializedContext } from "../../core/UserProvider";
import { useDb, useLiveDb } from ".";
import { useLocalStorage } from "react-use";
import { FirestoreError, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase";
import { DataWithState } from "../interfaces/data.model";
import { getGuessData } from "../constants/guest-data";
import { useUpload } from "./firebase/storage";
import { StorageError, UploadMetadata, UploadResult } from "firebase/storage";

export function useStuffs(): [
  Stuff[],
  Dispatch<StuffAction>,
  boolean,
  FirestoreError | undefined
] {
  const user = useContext(UserContext);
  const userInitialized = useContext(UserInitializedContext);
  const [dbStuffs, loading, error] = useDb<Stuff[]>(
    `users/${user?.uid}/stuffs`
  );
  const [localStuffs, setLocalStuffs, removeLocalStuffs] =
    useLocalStorage<Stuff[]>("stuffs");
  const [stuffs, setStuffs] = useState<Stuff[]>([]);

  const dispatchWitSideEffect = useCallback(
    (action: StuffAction) => {
      const nextState = stuffsReducer(stuffs, action);
      if (user) {
        const ref = doc(firestore, `users/${user.uid}/stuffs`, action.stuff.id);
        switch (action.type) {
          case StuffActionType.ADD:
            setDoc(ref, action.stuff);
            break;
          case StuffActionType.UPDATE:
            updateDoc(ref, action.stuff);
            break;
          case StuffActionType.DELETE:
            deleteDoc(ref);
            break;
        }
      } else {
        setLocalStuffs(nextState);
      }
      setStuffs(nextState);
    },
    [user, stuffs]
  );

  //When user changes due to login, logout or initial load
  useEffect(() => {
    if (userInitialized) {
      if (!user) {
        setStuffs(localStuffs || getGuessData());
      } else if (localStuffs) {
        removeLocalStuffs();
      }
    }
  }, [user, userInitialized]);

  useEffect(() => {
    if (dbStuffs) {
      setStuffs(dbStuffs);
    }
  }, [dbStuffs]);

  return [stuffs, dispatchWitSideEffect, loading, error];
}

export function useGetShelfLife(existingRequestId?: string): {
  id: string;
  getShelfLife: (item: string, gpt: GptVersion) => void;
  clearShelfLife: () => void;
  freezer: DataWithState<Durability, any, true, "object">;
  fridge: DataWithState<Durability, any, true, "object">;
  outside: DataWithState<Durability, any, true, "object">;
  emoji: DataWithState<string, any, true, "object">;
  category: DataWithState<string, any, true, "object">;
} {
  const [id, setId] = useState<string>(existingRequestId ?? uuidv4());
  const [fridge, setFridge] = useState<Durability>();
  const [freezer, setFreezer] = useState<Durability>();
  const [outside, setOutside] = useState<Durability>();
  const [emoji, setEmoji] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [getFreezer, freezerLoading, freezerError] = useCallable<
    AIRequest<DurabiltityQuery>,
    AIResponse
  >("queryAI");
  const [getFridge, fridgeLoading, fridgeError] = useCallable<
    AIRequest<DurabiltityQuery>,
    AIResponse
  >("queryAI");
  const [getOutside, outsideLoading, outsideError] = useCallable<
    AIRequest<DurabiltityQuery>,
    AIResponse
  >("queryAI");
  const [getEmoji, emojiLoading, emojiError] = useCallable<
    AIRequest<BaseQuery>,
    AIResponse
  >("queryAI");
  const [getCategory, categoryLoading, categoryError] = useCallable<
    AIRequest<BaseQuery>,
    AIResponse
  >("queryAI");

  function clearShelfLife() {
    fridge && setFridge(undefined);
    freezer && setFreezer(undefined);
    outside && setOutside(undefined);
    emoji && setEmoji("");
    category && setCategory("");
  }

  async function getShelfLife(item: string, gpt: GptVersion = GptVersion.THREE, existingId?: string) {
    setId(existingId ?? uuidv4());
    await Promise.allSettled([
      getFreezer({ id, gpt, queryType: QueryType.DURABILITY, query: { item, stuffLocation: StuffLocation.FREEZER } }).then(
        (res) => setFreezer(mapResponse(res?.data?.response?.content))
      ),
      getFridge({ id, gpt, queryType: QueryType.DURABILITY, query: { item, stuffLocation: StuffLocation.FRIDGE } }).then((res) =>
        setFridge(mapResponse(res?.data?.response?.content))
      ),
      getOutside({ id, gpt, queryType: QueryType.DURABILITY, query: { item, stuffLocation: StuffLocation.OUTSIDE } }).then(
        (res) => setOutside(mapResponse(res?.data?.response?.content))
      ),
      getEmoji({ id, gpt, queryType: QueryType.EMOJI, query: { item } }).then((res) =>
        setEmoji(
          (res?.data?.response?.content ?? "").replace(/[\w\\\/\s,\(\)]+/g, "")
        )
      ),
      getCategory({ id, gpt, queryType: QueryType.CATEGORY, query: { item } }).then((res) =>
        setCategory((res?.data?.response?.content ?? "").trim())
      ),
    ]);
  }

  return {
    id,
    getShelfLife,
    clearShelfLife,
    freezer: {
      data: freezer,
      loading: freezerLoading,
      error: freezerError,
    },
    fridge: {
      data: fridge,
      loading: fridgeLoading,
      error: fridgeError,
    },
    outside: {
      data: outside,
      loading: outsideLoading,
      error: outsideError,
    },
    emoji: {
      data: emoji,
      loading: emojiLoading,
      error: emojiError,
    },
    category: {
      data: category,
      loading: categoryLoading,
      error: categoryError,
    },
  };
}

export function useObjectRecognition(): [(
  data: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata | undefined
) => Promise<UploadResult | undefined>, string, string, string[] | undefined, boolean, StorageError | FirestoreError | undefined] {
  const user = useContext(UserContext);
  const [upload, snapshot, uploading, uploadError] = useUpload();

  const idRef = useRef<string>(uuidv4());
  const fileName = `${user?.uid}_${idRef.current}`
  const [request, processingError] = useLiveDb<any>(`users/${user?.uid}/requests/${idRef.current}`);
  const [started, setStarted] = useState(false);
  const loading =
    uploading || (started && !request?.exists() && !processingError);
  const status = snapshot ? `Uploading ${Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)}%` : loading ? 'Processing' : started ? 'Done' : '';
  const error = uploadError || processingError;
  const cachedFn = useCallback(
    (data: Blob | Uint8Array | ArrayBuffer) => {
      setStarted(true);
      return upload(`images/objects/${fileName}.jpg`, data);
    },
    [user]
  );

  return [cachedFn, idRef.current, status, request?.get('object.objects'), loading, error];
}

export function useUsageStats(): DataWithState<number, any> {
  const user = useContext(UserContext);
  const [userData, loading, error] = useDb<any>(`users/${user?.uid}`);
  return [userData?.weeklyUsage ?? 0, loading, error];
}

function mapResponse(str: string | undefined): Durability {
  if (!str) {
    throw new Error("Invalid response");
  }
  const obj = JSON.parse(str);
  return {
    hours: obj.h,
    days: obj.d,
    isRecommended: obj.r,
    description: obj.c,
  };
}

function stuffsReducer(stuffs: Stuff[], action: StuffAction): Stuff[] {
  switch (action.type) {
    case StuffActionType.ADD:
      return [
        ...stuffs,
        {
          ...action.stuff,
          dateAdded: new Date().toString(),
        } as Stuff,
      ];
    case StuffActionType.UPDATE:
      return stuffs.map((s) => {
        if (s.id === action.stuff.id) {
          return { ...s, ...action.stuff };
        } else {
          return s;
        }
      });
    case StuffActionType.DELETE:
      return stuffs.filter((s) => s.id !== action.stuff.id);
    default:
      throw Error("Unknown action: " + action.type);
  }
}
