import { User } from "firebase/auth";
import { useUser } from "../shared/hooks";
import { ReactNode, createContext } from "react";

export const UserContext = createContext<User | null>(null);
export const UserInitializedContext = createContext<boolean>(false);

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, initialized] = useUser();
  return (
    <UserInitializedContext.Provider value={initialized}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </UserInitializedContext.Provider>
  );
}
