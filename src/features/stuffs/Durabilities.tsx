import { Stack } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { Durability, StuffLocation } from "../../shared/interfaces";
import DurabilityCard from "./DurabilityCard";
import { DataWithState } from "../../shared/interfaces/data.model";

export default function Durabilities({
  selectedLocation,
  freezer,
  fridge,
  outside,
  disabled,
  onLocationSelect = () => {},
}: {
  selectedLocation?: StuffLocation;
  freezer: DataWithState<Durability, any, true, "object">;
  fridge: DataWithState<Durability, any, true, "object">;
  outside: DataWithState<Durability, any, true, "object">;
  disabled?: boolean;
  onLocationSelect?: (location: StuffLocation) => void;
}) {
  return (
    <Stack
      direction="row"
      useFlexGap
      flexWrap="wrap"
      rowGap={2}
      columnGap={2}
      sx={{ width: isDesktop ? "auto" : "100%", justifyContent: "center" }}
    >
      <DurabilityCard
        stuffLocation={StuffLocation.FREEZER}
        durability={freezer}
        isSelected={selectedLocation === StuffLocation.FREEZER}
        onSelect={onLocationSelect}
        disabled={disabled || !freezer.data}
      ></DurabilityCard>
      <DurabilityCard
        stuffLocation={StuffLocation.FRIDGE}
        durability={fridge}
        isSelected={selectedLocation === StuffLocation.FRIDGE}
        onSelect={onLocationSelect}
        disabled={disabled || !fridge.data}
      ></DurabilityCard>
      <DurabilityCard
        stuffLocation={StuffLocation.OUTSIDE}
        durability={outside}
        isSelected={selectedLocation === StuffLocation.OUTSIDE}
        onSelect={onLocationSelect}
        disabled={disabled || !outside.data}
      ></DurabilityCard>
    </Stack>
  );
}
