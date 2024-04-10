import { Box } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { useUsageStats } from "../../shared/hooks/stats";
import PieChart from "../../shared/components/charts/PieChart";
import { useContext, useEffect } from "react";
import { HeaderContext } from "../../core/HeaderProvider";
import ScrollToTopHeading from "../../core/ScrollToTopHeading";
import {
  STUFF_CATEGORY_GROUPINGS,
  STUFF_EXPIRY_GROUPING,
} from "../../shared/interfaces";
import PieBarChart from "../../shared/components/charts/PieBarChart";
import { StuffsContext } from "../../core/StuffsProvider";

export default function Stats() {
  const { setHeader } = useContext(HeaderContext);
  const allStuffs = useContext(StuffsContext);
  const { modelUsage } = useUsageStats();
  useEffect(() => {
    setHeader?.({ title: "Stats", subtitle: "" });
    return () => setHeader?.({ title: "", subtitle: "" });
  }, []);
  return (
    <Box pt={isDesktop ? 4 : 0}>
      <ScrollToTopHeading title="Statistics" subtitle=""></ScrollToTopHeading>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 16,
          rowGap: 4,
          pb: isDesktop ? 0 : 2,
          pt: isDesktop ? 4 : 2,
          px: 2,
        }}
      >
        <PieBarChart
          data={allStuffs}
          pieTitle="Item Stats"
          barTitle="Expiry"
          pieGroupings={STUFF_CATEGORY_GROUPINGS}
          barGrouping={STUFF_EXPIRY_GROUPING}
        ></PieBarChart>
        {!!modelUsage[0]?.length && (
          <PieChart
            data={modelUsage}
            title="Usage Stats"
            withDonut={false}
            gap={false}
            labelLocation="legend"
            maxWidth="320px"
          ></PieChart>
        )}
      </Box>
    </Box>
  );
}
