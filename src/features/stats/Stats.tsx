import { Box } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { useItemStats, useUsageStats } from "../../shared/hooks/stats";
import PieChart from "./PieChart";
import { useContext, useEffect } from "react";
import { HeaderContext } from "../../core/HeaderProvider";
import ScrollToTopHeading from "../../core/ScrollToTopHeading";

export default function Stats() {
  const { setHeader } = useContext(HeaderContext);
  const itemsData = useItemStats();
  const { modelUsage } = useUsageStats();
  useEffect(() => {
    setHeader?.({ title: "Stats", subtitle: "" });
    return () => setHeader?.({ title: "", subtitle: "" });
  }, []);
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
      <ScrollToTopHeading title="Statistics" subtitle=""></ScrollToTopHeading>
      {!!itemsData[0]?.length && (
        <PieChart data={itemsData} title="Item Stats"></PieChart>
      )}
      {!!modelUsage[0]?.length && (
        <PieChart data={modelUsage} title="Usage Stats"></PieChart>
      )}
    </Box>
  );
}
