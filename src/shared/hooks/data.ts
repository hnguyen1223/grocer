import { Dispatch, useCallback, useContext, useEffect, useState } from "react";
import {
  Durability,
  StuffActionType,
  Stuff,
  StuffAction,
  StuffLocation,
} from "../interfaces";
import {
  BaseRequest,
  DurabiltityRequest,
  DurabiltityResponse,
  GptVersion,
} from "../interfaces/api.model";
import useCallable from "./firebase/functions";
import { v4 as uuidv4 } from "uuid";
import { UserContext, UserInitializedContext } from "../../core/UserProvider";
import { useDb } from ".";
import { useLocalStorage } from "react-use";
import {
  FirestoreError,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebase";

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
        setStuffs(localStuffs || []);
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

export function useGetShelfLife(): [
  (item: string, gpt: GptVersion) => void,
  () => void,
  Durability | undefined,
  Durability | undefined,
  Durability | undefined,
  boolean,
  boolean,
  boolean,
  any,
  any,
  any,
  string,
  string,
  string
] {
  const [id, setId] = useState<string>(uuidv4());
  const [fridge, setFridge] = useState<Durability>();
  const [freezer, setFreezer] = useState<Durability>();
  const [outside, setOutside] = useState<Durability>();
  const [emoji, setEmoji] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [getFreezer, freezerLoading, freezerError] = useCallable<
    DurabiltityRequest,
    DurabiltityResponse
  >("getShelfLife");
  const [getFridge, fridgeLoading, fridgeError] = useCallable<
    DurabiltityRequest,
    DurabiltityResponse
  >("getShelfLife");
  const [getOutside, outsideLoading, outsideError] = useCallable<
    DurabiltityRequest,
    DurabiltityResponse
  >("getShelfLife");
  const [getEmoji] = useCallable<BaseRequest, DurabiltityResponse>("getEmoji");
  const [getCategory] = useCallable<BaseRequest, DurabiltityResponse>(
    "getCategory"
  );

  function clearShelfLife() {
    fridge && setFridge(undefined);
    freezer && setFreezer(undefined);
    outside && setOutside(undefined);
    emoji && setEmoji("");
  }

  async function getShelfLife(item: string, gpt: 3 | 4 = 3) {
    setId(uuidv4());
    await Promise.allSettled([
      getFreezer({ id, item, location: StuffLocation.FREEZER, gpt }).then(
        (res) => setFreezer(mapResponse(res?.data?.response?.content))
      ),
      getFridge({ id, item, location: StuffLocation.FRIDGE, gpt }).then((res) =>
        setFridge(mapResponse(res?.data?.response?.content))
      ),
      getOutside({ id, item, location: StuffLocation.OUTSIDE, gpt }).then(
        (res) => setOutside(mapResponse(res?.data?.response?.content))
      ),
      getEmoji({ id, item, gpt }).then((res) =>
        setEmoji(
          (res?.data?.response?.content ?? "").replace(/[\w\\\/\s,\(\)]+/g, "")
        )
      ),
      getCategory({ id, item, gpt }).then((res) =>
        setCategory((res?.data?.response?.content ?? "").trim())
      ),
    ]);
  }

  return [
    getShelfLife,
    clearShelfLife,
    freezer,
    fridge,
    outside,
    freezerLoading,
    fridgeLoading,
    outsideLoading,
    freezerError,
    fridgeError,
    outsideError,
    id,
    emoji,
    category,
  ];
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
