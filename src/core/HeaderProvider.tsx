import { ReactNode, createContext, useState } from "react";
import { Header } from "../shared/interfaces";

export const PathContext = createContext<string>("");
export const HeaderContext = createContext<{
  header?: Header;
  showHeader?: boolean;
  setHeader?: (header: Header) => void;
  setShowHeader?: (showHeader: boolean) => void;
}>({});
export default function HeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<Header>();
  const [showHeader, setShowHeader] = useState<boolean>();
  return (
    <HeaderContext.Provider
      value={{ header, setHeader, showHeader, setShowHeader }}
    >
      {children}
    </HeaderContext.Provider>
  );
}
