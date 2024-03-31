import { Divider, List } from "@mui/material";
import { Stuff, StuffLocation, StuffView } from "../../shared/interfaces";
import StuffRow from "./StuffRow";
import { isDesktop } from "react-device-detect";
import CollapsibleList from "../../shared/components/CollapsibleList";
import LocationIcon from "../../shared/components/LocationIcon";
import { useContext } from "react";
import { StuffViewContext } from "./Stuffs";

export default function StuffList({
  stuffs,
  heading,
}: {
  stuffs: Stuff[];
  heading?: string;
}) {
  const view = useContext(StuffViewContext);
  const icon = (
    <>
      {view === StuffView.LOCATION ? (
        <LocationIcon stuffLocation={heading as StuffLocation}></LocationIcon>
      ) : undefined}
    </>
  );

  return (
    stuffs.length > 0 && (
      <CollapsibleList heading={heading} subtitle="Expiry" icon={icon}>
        <List sx={{ width: isDesktop ? "760px" : "auto" }}>
          {stuffs.map((stuff, index) => (
            <div key={stuff.id}>
              <StuffRow stuff={stuff}></StuffRow>
              {index < stuffs.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </CollapsibleList>
    )
  );
}
