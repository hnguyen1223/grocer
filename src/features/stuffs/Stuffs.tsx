import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StuffsContext } from "../../core/StuffsProvider";
import dayjs from "dayjs";
import { Stuff, StuffView } from "../../shared/interfaces";
import StuffList from "./StuffList";
import { Box } from "@mui/material";
import { HeaderContext } from "../../core/HeaderProvider";
import Heading from "../../shared/components/Heading";
import { isDesktop } from "react-device-detect";
import ViewControl from "./ViewControl";
import { Outlet } from "react-router-dom";

export const StuffViewContext = createContext<StuffView | null>(
  StuffView.EXPIRY
);
export const SetStuffViewContext = createContext<(view: StuffView) => void>(
  () => {}
);
export default function Stuffs() {
  const allStuffs = useContext(StuffsContext);
  const { showHeader, setHeader, setShowHeader } = useContext(HeaderContext);
  const showHeaderRef = useRef<boolean>(!!showHeader);
  const setShowHeaderRef = (show: boolean) => {
    showHeaderRef.current = show;
    setShowHeader?.(show);
  };
  const [view, setView] = useState<StuffView>(StuffView.EXPIRY);
  const today = dayjs(new Date());
  const lists: { [key: string]: Stuff[] } = useMemo(
    () =>
      allStuffs.reduce((acc: { [key: string]: Stuff[] }, stuff) => {
        switch (view) {
          case StuffView.EXPIRY:
            if (today.isAfter(stuff.expiryDate)) {
              acc["expired"] = acc["expired"] || [];
              acc["expired"].push(stuff);
            } else if (today.diff(stuff.expiryDate, "D") < 3) {
              acc["expiring"] = acc["expiring"] || [];
              acc["expiring"].push(stuff);
            } else {
              acc["others"] = acc["others"] || [];
              acc["others"].push(stuff);
            }
            break;
          case StuffView.CATEGORY:
            acc[stuff.category] = acc[stuff.category] || [];
            acc[stuff.category].push(stuff);
            break;
          case StuffView.LOCATION:
            acc[stuff.location] = acc[stuff.location] || [];
            acc[stuff.location].push(stuff);
            break;
        }
        return acc;
      }, {}),
    [allStuffs, view]
  );

  const subtitle =
    allStuffs.length + " item" + (allStuffs.length > 1 ? "s" : "");

  useEffect(() => {
    function handleScroll(e: any) {
      if (e.target.scrollTop > 24 && !showHeaderRef.current) {
        setShowHeaderRef(true);
      } else if (e.target.scrollTop <= 24 && showHeaderRef.current) {
        setShowHeaderRef(false);
      }
    }
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setHeader?.({ title: "Stuffs", subtitle });
  }, [allStuffs]);

  return (
    <SetStuffViewContext.Provider value={setView}>
      <StuffViewContext.Provider value={view}>
        <ViewControl></ViewControl>
        <Box
          sx={{
            overflowY: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: isDesktop ? "center" : "stretch",
            pt: isDesktop ? 2 : 0,
          }}
        >
          <Heading
            show={!showHeader}
            title="Stuffs"
            subtitle={subtitle}
          ></Heading>

          {Object.entries(lists).map(([key, value]) => (
            <StuffList key={key} stuffs={value} heading={key}></StuffList>
          ))}
        </Box>
        <Outlet />
      </StuffViewContext.Provider>
    </SetStuffViewContext.Provider>
  );
}
