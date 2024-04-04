import {
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
  FirestoreError,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  Unsubscribe,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { firestore } from "../../../../firebase";
import { useEffect, useState } from "react";

export function useDb<T extends DocumentData>(
  path: string,
  converter?: FirestoreDataConverter<T, DocumentData>
): [T | undefined, boolean, FirestoreError | undefined];
export function useDb<T extends DocumentData[]>(
  path: string,
  converter?: FirestoreDataConverter<T, DocumentData>
): [T[] | undefined, boolean, FirestoreError | undefined];
export function useDb<T extends DocumentData | DocumentData[]>(
  path: string,
  converter: FirestoreDataConverter<T, DocumentData> = {
    toFirestore: (data) => data,
    fromFirestore: (snapshot) => snapshot.data() as any,
  }
): [T | T[] | undefined, boolean, FirestoreError | undefined] {
  const [snapshot, setSnapshot] = useState<T | T[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError>();
  let didCancel = false;

  async function fetchData() {
    try {
      const paths = path.split("/");
      if (paths.some((p) => !p.length)) {
        throw new Error("invalid-argument");
      }
      const isCollection = paths.length % 2 === 1;
      let data: T | T[] | undefined;

      setLoading(true);
      setError(undefined);
      if (isCollection) {
        const ref = collection(firestore, path).withConverter(converter);
        data = (await getDocs(ref)).docs.map((doc) => doc.data());
      } else {
        const ref = doc(firestore, path).withConverter(converter);
        data = (await getDoc(ref)).data();
      }
      setLoading(false);
      if (!didCancel) {
        setSnapshot(data);
      }
    } catch (error) {
      setError(error as FirestoreError);
      setSnapshot(undefined);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [path]);

  return [snapshot, loading, error];
}

export function useLiveDb<T extends DocumentData>(
  path: string,
  converter?: FirestoreDataConverter<T, DocumentData>
): [DocumentSnapshot<T> | undefined, FirestoreError | undefined];
export function useLiveDb<T extends DocumentData[]>(
  path: string,
  converter?: FirestoreDataConverter<T, DocumentData>,
  filters?: QueryFieldFilterConstraint[]
): [QueryDocumentSnapshot<T>[] | undefined, FirestoreError | undefined];
export function useLiveDb<T extends DocumentData | DocumentData[]>(
  path: string,
  converter: FirestoreDataConverter<T, DocumentData> = {
    toFirestore: (data) => data,
    fromFirestore: (snapshot) => snapshot.data() as any,
  },
  filters: QueryFieldFilterConstraint[] = []
): [
  DocumentSnapshot<T> | QueryDocumentSnapshot<T>[] | undefined,
  FirestoreError | undefined
] {
  const [snapshot, setSnapshot] = useState<
    DocumentSnapshot<T> | QueryDocumentSnapshot<T>[] | undefined
  >();
  const [error, setError] = useState<FirestoreError>();
  useEffect(() => {
    try {
      const paths = path.split("/");
      if (paths.some((p) => !p.length)) {
        throw new Error("invalid-argument");
      }
      const isCollection = paths.length % 2 === 1;
      let unsubscribe: Unsubscribe;
      setError(undefined);
      if (isCollection) {
        const ref = query(
          collection(firestore, path).withConverter(converter),
          ...filters
        );
        unsubscribe = onSnapshot(
          ref,
          (qSnapshot) => setSnapshot(qSnapshot.docs),
          setError
        );
      } else {
        const ref = doc(firestore, path).withConverter(converter);
        unsubscribe = onSnapshot(
          ref,
          (snapshot) => setSnapshot(snapshot),
          setError
        );
      }

      return () => unsubscribe();
    } catch (error) {
      setError(error as FirestoreError);
      setSnapshot(undefined);
    }
  }, []);

  return [snapshot, error];
}
