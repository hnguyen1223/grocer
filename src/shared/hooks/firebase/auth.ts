import {
  Auth,
  AuthError,
  CustomParameters,
  GoogleAuthProvider,
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import {
  AuthProviderID,
  SignInFn,
  SignInMethod,
  SignOutFn,
} from "../../interfaces";
import { isDesktop } from "react-device-detect";
import { auth } from "../../../../firebase";
import { DataWithState } from "../../interfaces/data.model";

export function useUser(): [User | null, boolean] {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      !initialized && setInitialized(true);
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);
  return [user, initialized];
}

export function useProviderSignIn(
  providerId: AuthProviderID,
  scopes: string[] = [],
  customParameters: CustomParameters = {}
): DataWithState<SignInFn<SignInMethod.PROVIDER>, AuthError> {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const cachedSignInFn = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      let provider: any; // BaseOAuthProvider not exported
      switch (providerId) {
        case AuthProviderID.GOOGLE:
          provider = new GoogleAuthProvider();
          break;
        default:
          throw new Error(`Provider ${providerId} not supported`);
      }
      scopes.forEach((scope) => provider.addScope(scope));
      provider.setCustomParameters(customParameters);
      return isDesktop
        ? signInWithPopup(auth, provider)
        : signInWithRedirect(auth, provider);
    } catch (error) {
      setError(error as AuthError);
    } finally {
      setLoading(false);
    }
  }, [providerId, scopes, customParameters]);

  return [cachedSignInFn, loading, error];
}

export function useEmailAndPasswordSignIn(): DataWithState<
  SignInFn<SignInMethod.EMAIL_AND_PASSWORD>,
  AuthError
> {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);

  const cachedSignInFn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(undefined);
      try {
        return signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setError(error as AuthError);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return [cachedSignInFn, loading, error];
}

export function useSignOut(auth: Auth): DataWithState<SignOutFn, AuthError> {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);
  const cachedSignOutFn = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      await auth.signOut();
    } catch (error) {
      setError(error as AuthError);
    } finally {
      setLoading(false);
    }
  }, [auth]);
  return [cachedSignOutFn, loading, error];
}
