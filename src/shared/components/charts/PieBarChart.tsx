import { memo, useMemo, useState } from "react";
import {
  ChartElement,
  DataGrouping,
  getStats,
  groupElement,
} from "../../interfaces";
import PieChart from "./PieChart";
import { Box } from "@mui/material";
import * as d3 from "d3";
import BarChart from "./BarChart";

function PieBarChart<T>({
  pieTitle,
  barTitle,
  data,
  pieGroupings,
  barGrouping,
}: {
  pieTitle: string;
  barTitle: string;
  data: T[];
  pieGroupings: DataGrouping<T>[];
  barGrouping: DataGrouping<T>;
}) {
  const [barData, setBarData] = useState<ChartElement<T>[]>([]);
  const pieData = useMemo(
    () => getStats(data, pieGroupings),
    [data, pieGroupings]
  );

  const colors = useMemo(() => {
    const labels = Array.from(
      new Set(
        pieData
          .flatMap((d) => d.map((g) => g.label))
          .concat(
            barGrouping
              ? groupElement(data, barGrouping).map((g) => g.label)
              : []
          )
      )
    );
    return d3
      .scaleOrdinal<string>()
      .domain(labels)
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.7 + 0.2), labels.length)
          .reverse()
      );
  }, [data, pieGroupings, barGrouping]);

  function handleArcInteraction(dataSlice: T[]) {
    setBarData(groupElement(dataSlice, barGrouping));
  }

  return (
    <Box
      sx={{
        width: "460px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        rowGap: 2,
      }}
    >
      <PieChart
        reuseColors={colors}
        data={pieData}
        title={pieTitle}
        onArcInteraction={handleArcInteraction}
      ></PieChart>
      {!!barData.length && (
        <BarChart
          reuseColors={colors}
          data={barData}
          title={barTitle}
          background={true}
          maxWidth="60%"
        ></BarChart>
      )}
    </Box>
  );
}

export default memo(PieBarChart) as typeof PieBarChart;
