import { Dispatch, useCallback, useContext, useEffect, useState } from "react";
import {
  Durability,
  STUFF_ACTION_TYPE,
  Stuff,
  StuffAction,
  StuffLocation,
} from "../interfaces";
import {
  DurabiltityRequest,
  DurabiltityResponse,
  EmojiRequest,
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
  console.log("useStuffs", { stuffs, dbStuffs, localStuffs, loading, error });

  const dispatchWitSideEffect = useCallback(
    (action: StuffAction) => {
      console.log("dispatchWitFirestore", action, stuffs);
      const nextState = stuffsReducer(stuffs, action);
      if (user) {
        const ref = doc(firestore, `users/${user.uid}/stuffs`, action.stuff.id);
        switch (action.type) {
          case STUFF_ACTION_TYPE.ADD:
            setDoc(ref, action.stuff);
            break;
          case STUFF_ACTION_TYPE.UPDATE:
            updateDoc(ref, action.stuff);
            break;
          case STUFF_ACTION_TYPE.DELETE:
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
    console.log("user changed", user, userInitialized);
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
      console.log("dbStuffs");
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
  string
] {
  const [id, setId] = useState<string>(uuidv4());
  const [fridge, setFridge] = useState<Durability>();
  const [freezer, setFreezer] = useState<Durability>();
  const [outside, setOutside] = useState<Durability>();
  const [emoji, setEmoji] = useState<string>("");

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
  const [getEmoji, _1, _2] = useCallable<EmojiRequest, DurabiltityResponse>(
    "getEmoji"
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
    case STUFF_ACTION_TYPE.ADD:
      return [
        ...stuffs,
        {
          ...action.stuff,
          dateAdded: new Date().toString(),
        } as Stuff,
      ];
    case STUFF_ACTION_TYPE.UPDATE:
      return stuffs.map((s) => {
        if (s.id === action.stuff.id) {
          return { ...s, ...action.stuff };
        } else {
          return s;
        }
      });
    case STUFF_ACTION_TYPE.DELETE:
      return stuffs.filter((s) => s.id !== action.stuff.id);
    default:
      throw Error("Unknown action: " + action.type);
  }
}
