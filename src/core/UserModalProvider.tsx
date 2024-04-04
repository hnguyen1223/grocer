import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export const UserModalContext = createContext<boolean>(false);
export const SetUserModalContext = createContext<
  Dispatch<SetStateAction<boolean>>
>(() => {});
export default function UserModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isModalShown, setIsModalShown] = useState(false);
  return (
    <SetUserModalContext.Provider value={setIsModalShown}>
      <UserModalContext.Provider value={isModalShown}>
        {children}
      </UserModalContext.Provider>
    </SetUserModalContext.Provider>
  );
}
