import { UserCredential } from "firebase/auth";

export type SignInFn<T extends SignInMethod> =
  T extends SignInMethod.EMAIL_AND_PASSWORD
    ? (email: string, password: string) => Promise<UserCredential | undefined>
    : () => Promise<UserCredential | undefined> | Promise<never>;

export type SignOutFn = () => Promise<void>;

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
