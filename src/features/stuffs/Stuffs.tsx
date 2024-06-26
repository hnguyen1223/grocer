import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { StuffsContext } from "../../core/StuffsProvider";
import dayjs from "dayjs";
import { Stuff, StuffView } from "../../shared/interfaces";
import StuffList from "./StuffList";
import { Box } from "@mui/material";
import { HeaderContext } from "../../core/HeaderProvider";
import { isDesktop } from "react-device-detect";
import ViewControl from "./ViewControl";
import { Outlet } from "react-router-dom";
import { getExpiryDate } from "../../shared/utils/expiry";
import Empty from "./Empty";
import ScrollToTopHeading from "../../core/ScrollToTopHeading";

export const StuffViewContext = createContext<StuffView | null>(
  StuffView.EXPIRY
);
export const SetStuffViewContext = createContext<(view: StuffView) => void>(
  () => {}
);
export default function Stuffs() {
  const allStuffs = useContext(StuffsContext);
  const { setHeader } = useContext(HeaderContext);
  const [view, setView] = useState<StuffView>(StuffView.EXPIRY);
  const today = dayjs(new Date());
  //TODO add view for finished stuffs
  const unfishedStuffs = allStuffs.filter((stuff) => !stuff.status);
  const lists: { [key: string]: Stuff[] } = useMemo(() => {
    const lists = unfishedStuffs.reduce(
      (acc: { [key: string]: Stuff[] }, stuff) => {
        switch (view) {
          case StuffView.EXPIRY:
            {
              const expiryDate = getExpiryDate(stuff);
              if (
                today.isAfter(expiryDate) &&
                today.diff(expiryDate, "d") !== 0
              ) {
                acc["expired"] = acc["expired"] || [];
                acc["expired"].push(stuff);
              } else if (Math.abs(today.diff(expiryDate, "d")) < 3) {
                acc["in 3 days"] = acc["in 3 days"] || [];
                acc["in 3 days"].push(stuff);
              } else {
                acc["later"] = acc["later"] || [];
                acc["later"].push(stuff);
              }
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
      },
      {}
    );

    // TODO improve sorting & add sorting controls
    Object.keys(lists).forEach(
      (key) =>
        (lists[key] = lists[key].sort((a, b) =>
          getExpiryDate(a).isBefore(getExpiryDate(b)) ? -1 : 1
        ))
    );
    return lists;
  }, [allStuffs, view]);

  const subtitle =
    allStuffs.length + " item" + (allStuffs.length > 1 ? "s" : "");

  useEffect(() => {
    setHeader?.({ title: "Stuffs", subtitle });
    return () => setHeader?.({ title: "", subtitle: "" });
  }, [allStuffs]);

  return (
    <SetStuffViewContext.Provider value={setView}>
      <StuffViewContext.Provider value={view}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: isDesktop ? "center" : "stretch",
            pt: isDesktop ? 2 : 0,
          }}
        >
          {unfishedStuffs.length === 0 ? (
            <Empty />
          ) : (
            <>
              <ViewControl></ViewControl>
              <ScrollToTopHeading
                title="Stuffs"
                subtitle={subtitle}
              ></ScrollToTopHeading>
              {Object.keys(lists)
                .sort()
                .map((key) => (
                  <StuffList
                    key={key}
                    stuffs={lists[key]}
                    heading={key}
                  ></StuffList>
                ))}
            </>
          )}
        </Box>
        <Outlet />
      </StuffViewContext.Provider>
    </SetStuffViewContext.Provider>
  );
}
