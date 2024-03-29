import { ReactNode, createContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const PathContext = createContext<string>("");
export default function PathProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  let pageName = location.pathname.split("/")[1];
  pageName = pageName.charAt(0)?.toUpperCase() + pageName.slice(1);
  useEffect(() => {
    document.title = pageName && `${pageName} | ` + "Grocer";
  });
  return (
    <PathContext.Provider value={pageName}>{children}</PathContext.Provider>
  );
}
