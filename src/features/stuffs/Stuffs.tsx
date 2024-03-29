import { useContext } from "react";
import { StuffsContext } from "../../core/StuffsProvider";
import dayjs from "dayjs";
import { Stuff } from "../../shared/interfaces";
import StuffList from "./StuffList";
import { Box } from "@mui/material";

export default function Stuffs() {
  const stuffs = useContext(StuffsContext);
  const today = dayjs(new Date());
  const expired: Stuff[] = [];
  const expiring: Stuff[] = [];
  const rest: Stuff[] = [];
  stuffs?.forEach((stuff) => {
    if (today.isAfter(stuff.expiryDate)) {
      expired.push(stuff);
    } else if (today.diff(stuff.expiryDate, "D") < 3) {
      expiring.push(stuff);
    } else {
      rest.push(stuff);
    }
  });

  return (
    <Box
      sx={{
        overflowY: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StuffList stuffs={expired} title="Expired"></StuffList>
      <StuffList stuffs={expiring} title="Expiring"></StuffList>
      <StuffList stuffs={rest} title="Others"></StuffList>
    </Box>
  );
}
