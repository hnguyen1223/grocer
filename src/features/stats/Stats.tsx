import { Box } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { useItemStats, useUsageStats } from "../../shared/hooks/stats";
import PieChart from "./PieChart";

export default function Stats() {
  const itemsData = useItemStats();
  const { modelUsage } = useUsageStats();
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 12,
        rowGap: 2,
        pt: isDesktop ? 4 : 0,
        pb: isDesktop ? 0 : 2,
        px: 2,
      }}
    >
      {!!itemsData[0]?.length && (
        <PieChart data={itemsData} title="Item Stats"></PieChart>
      )}
      {!!modelUsage[0]?.length && (
        <PieChart data={modelUsage} title="Usage Stats"></PieChart>
      )}
    </Box>
  );
}
