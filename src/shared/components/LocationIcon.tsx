import { AcUnit, Kitchen, Thermostat } from "@mui/icons-material";
import { StuffLocation } from "../interfaces";

export default function LocationIcon({
  stuffLocation,
}: {
  stuffLocation: StuffLocation;
}) {
  return stuffLocation === StuffLocation.FREEZER ? (
    <AcUnit sx={{ color: "dodgerblue" }} />
  ) : stuffLocation === StuffLocation.FRIDGE ? (
    <Kitchen sx={{ color: "lightblue" }} />
  ) : (
    <Thermostat color="warning" />
  );
}
