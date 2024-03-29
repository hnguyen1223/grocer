import { AuthError, UserCredential } from "firebase/auth";

export type SignInFn<T extends SignInMethod> =
  T extends SignInMethod.EMAIL_AND_PASSWORD
    ? (email: string, password: string) => Promise<UserCredential | undefined>
    : () => Promise<UserCredential | undefined> | Promise<never>;

export type SignInHook<T extends SignInMethod> = [
  SignInFn<T>,
  boolean,
  AuthError | undefined
];

export type SignOutFn = () => Promise<void>;

export type SignOutHook = [SignOutFn, boolean, AuthError | undefined];

export enum SignInMethod {
  EMAIL_AND_PASSWORD = "emailAndPassword",
  PROVIDER = "provider",
}

export enum AuthProviderID {
  GOOGLE = "google.com",
  //   FACEBOOK = "facebook.com",
  //   TWITTER = "twitter.com",
  //   GITHUB = "github.com",
  //   APPLE = "apple.com",
  //   YAHOO = "yahoo.com",
  //   MICROSOFT = "hotmail.com",
}
