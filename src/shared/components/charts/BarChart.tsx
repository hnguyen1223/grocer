import { Box, Typography, useTheme } from "@mui/material";
import { BarChartProps, ChartElement } from "../../interfaces";
import { memo, useEffect, useRef } from "react";
import * as d3 from "d3";

const DEFAULT_MAX_WIDTH = "460px";
const CHART_WIDTH = 100;
const BAR_HEIGHT = 20;
const PADDING = 5;
function BarChart<T>({
  title,
  data,
  reuseColors,
  maxWidth,
  background,
}: BarChartProps<ChartElement<T>[]>) {
  const theme = useTheme();
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const labels = data.map((d) => d.label);
    const color =
      reuseColors ??
      d3
        .scaleOrdinal<string>()
        .domain(labels)
        .range(
          d3
            .quantize(
              (t) => d3.interpolateSpectral(t * 0.7 + 0.2),
              labels.length
            )
            .reverse()
        );
    const chartHeight = data.length * BAR_HEIGHT;
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) ?? 0])
      .range([0, CHART_WIDTH]);
    console.log(x(4));

    const y = d3
      .scaleBand()
      .domain(d3.sort(data, (d) => -d.count).map((d) => d.label))
      .rangeRound([0, chartHeight])
      .padding(0.3);

    const chart = d3.select(chartRef.current).select(".chart");
    chart
      .call((g) => g.select(".y-axis").remove())
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickSize(0))
      .attr("font-size", "0.4rem")
      .attr("font-weight", "bold")
      .selectAll(".domain")
      .attr("stroke-width", 0.3);

    chart
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("fill", (d) => color(d.label))
      .attr("x", x(0))
      .attr("height", y.bandwidth())
      .transition()
      .duration(250)
      .attr("y", (d) => y(d.label) ?? 0)
      .attr("width", (d) => x(d.count) - x(0));

    chart
      .selectAll(".count")
      .data(data)
      .join("text")
      .attr("class", "count")
      .attr("font-size", "0.4rem")
      .attr("x", (d) => x(d.count) + 2)
      .attr("y", (d) => (y(d.label) ?? 0) + y.bandwidth() / 2)
      .attr("dy", "0.4em")
      .text((d) => d.count);

    const box = (chart.node() as SVGGElement)?.getBBox();
    d3.select(chartRef.current).attr(
      "viewBox",
      `${box.x - PADDING} ${box.y} ${box.width + PADDING * 2} ${box.height}`
    );
  }, [data]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: maxWidth || DEFAULT_MAX_WIDTH,
        backgroundColor: background ? theme.palette.grey[200] : "transparent",
        borderRadius: 3,
        py: 2,
      }}
    >
      {title && (
        <Typography variant="h5" textAlign="center" mb={1}>
          {title}
        </Typography>
      )}
      <svg ref={chartRef}>
        <g className="chart"></g>
      </svg>
    </Box>
  );
}

export default memo(BarChart) as typeof BarChart;
