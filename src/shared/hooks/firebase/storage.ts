import {
  StorageError,
  UploadMetadata,
  UploadResult,
  UploadTaskSnapshot,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useCallback, useState } from "react";
import { storage } from "../../../../firebase";

export function useUpload(): [
  (
    path: string,
    data: Blob | Uint8Array | ArrayBuffer,
    metadata?: UploadMetadata | undefined
  ) => Promise<UploadResult | undefined>,
  UploadTaskSnapshot | undefined,
  boolean,
  StorageError | undefined
] {
  const [error, setError] = useState<StorageError>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<UploadTaskSnapshot>();
  const cachedFn = useCallback(
    async (
      path: string,
      data: Blob | Uint8Array | ArrayBuffer,
      metadata?: UploadMetadata | undefined
    ): Promise<UploadResult | undefined> => {
      const fileRef = ref(storage, path);
      return new Promise((resolve) => {
        setUploading(true);
        setError(undefined);
        const task = uploadBytesResumable(fileRef, data, metadata);
        task.on(
          "state_changed",
          (snapshot) => {
            setSnapshot(snapshot);
          },
          (error) => {
            setUploading(false);
            setError(error);
            resolve(undefined);
          },
          () => {
            setUploading(false);
            setSnapshot(undefined);
            resolve({
              metadata: task.snapshot.metadata,
              ref: task.snapshot.ref,
            });
          }
        );
      });
    },
    []
  );
  return [cachedFn, snapshot, uploading, error];
}
