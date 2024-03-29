import { ReactNode, createContext, useState } from "react";

export const CreateModalContext = createContext<boolean>(false);
export const CreateModalTogglerContext = createContext<
  (isShown: boolean) => void
>((isShown: boolean) => {});
export default function CreateStuffProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isModalShown, setIsModalShown] = useState(false);
  return (
    <CreateModalTogglerContext.Provider value={setIsModalShown}>
      <CreateModalContext.Provider value={isModalShown}>
        {children}
      </CreateModalContext.Provider>
    </CreateModalTogglerContext.Provider>
  );
}
