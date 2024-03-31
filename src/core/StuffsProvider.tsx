import { Dispatch, ReactNode, createContext } from "react";
import { Stuff } from "../shared/interfaces";
import { StuffAction } from "../shared/interfaces";
import { useStuffs } from "../shared/hooks";

export const StuffsContext = createContext<Stuff[]>([]);
export const StuffsDispatchContext = createContext<Dispatch<StuffAction>>(
  () => {}
);

export function StuffsProvider({ children }: { children: ReactNode }) {
  const [stuffs, dispatch] = useStuffs();
  return (
    <StuffsContext.Provider value={stuffs}>
      <StuffsDispatchContext.Provider value={dispatch}>
        {children}
      </StuffsDispatchContext.Provider>
    </StuffsContext.Provider>
  );
}
