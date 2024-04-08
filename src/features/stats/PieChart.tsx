import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Typography, useTheme } from "@mui/material";
import { ChartElement } from "../../shared/interfaces/stats.model";

const SVG_SIZE = 100;
const DEFAULT_PADDING = 10;
const LEGEND_HEIGHT = 5;

export interface PieChartConfig {
  padding?: number;
  withDonut?: boolean;
  outerLabelPosition?: "inside" | "oustide";
  gap?: boolean;
  lengends?: boolean;
  text?: "label" | "count";
}
export default function PieChart<T>({
  title,
  data,
  config = {
    padding: DEFAULT_PADDING,
    withDonut: true,
    outerLabelPosition: "inside",
    gap: true,
    lengends: false,
    text: "label",
  },
}: {
  title: string;
  data: ChartElement<T>[][];
  config?: PieChartConfig;
}) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const idRef = useRef<string>(uuidv4());
  const theme = useTheme();
  const includeDonut = config?.withDonut ? 0.5 : 0;
  const padding = config?.padding || DEFAULT_PADDING;
  const labels = Array.from(
    new Set(data.flatMap((d) => d.map((g) => g.label)))
  );
  const svgHeight = config?.lengends
    ? SVG_SIZE + (labels.length + 1) * LEGEND_HEIGHT
    : SVG_SIZE;
  useEffect(() => {
    const ringRadius = (SVG_SIZE - padding) / 2 / (data.length + includeDonut);
    const color = d3
      .scaleOrdinal<string>()
      .domain(labels)
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.7 + 0.2), labels.length)
          .reverse()
      );
    const legends = config?.lengends ? labels : [];

    d3.select(chartRef.current)
      .select(".legends")
      .selectAll(".legend")
      .data(legends)
      .join(
        (enter) => {
          const legend = enter
            .append("g")
            .attr("class", "legend")
            .attr("transform", (_, i) => `translate(0,${i * 5})`);

          legend
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 4)
            .attr("height", 4)
            .attr("fill", (d) => color(d));

          legend
            .append("text")
            .attr("x", 6)
            .attr("y", 3)
            .attr("fill", theme.palette.text.secondary)
            .text((d) => d);
          return legend;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    const pie = d3
      .pie<ChartElement<T>>()
      .sort(null)
      .value((d) => d.count);

    data.forEach((ring, index) => {
      const innerRadius = (index + includeDonut) * ringRadius;
      const outerRadius = (index + 1 + includeDonut) * ringRadius;
      const isLabelOutside =
        index === data.length - 1 && config?.outerLabelPosition === "oustide";
      const arcs = pie(ring);
      const arc = d3
        .arc<d3.PieArcDatum<ChartElement<T>>>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

      const arcLabel = d3
        .arc<d3.PieArcDatum<ChartElement<T>>>()
        .innerRadius(isLabelOutside ? outerRadius : innerRadius)
        .outerRadius(outerRadius);

      d3.select(chartRef.current)
        .select(".chart")
        .selectAll(".ring" + index)
        .data(arcs)
        .join("path")
        .attr("class", "ring" + index)
        .attr("stroke", "white")
        .attr("stroke-width", config?.gap ? 1 : 0)
        .attr("fill", (d) => color(d.data.label))
        .attr("d", arc);

      d3.select(chartRef.current)
        .select(".chart")
        .selectAll(".text" + index)
        .data(arcs)
        .join("text")
        .attr("class", "text" + index)
        .attr("transform", (d) => {
          const [x, y] = arcLabel.centroid(d);
          return `translate(${x}, ${y})`;
        })
        .attr("font-size", "0.2rem")
        .attr("font-weight", "600")
        .attr("fill", theme.palette.text.secondary)
        .attr("text-anchor", (d) =>
          isLabelOutside
            ? arcLabel.centroid(d)[0] > 0
              ? "start"
              : "end"
            : "middle"
        )
        .text((d) => (config?.text === "count" ? d.data.count : d.data.label));
    });
  }, [data]);

  return (
    <Box sx={{ flex: "0 1 420px" }}>
      <Typography variant="h5" textAlign="center">
        {title}
      </Typography>
      <svg
        ref={chartRef}
        id={`pie-chart-${idRef.current}`}
        viewBox={`${-SVG_SIZE / 2} ${-SVG_SIZE / 2} ${SVG_SIZE} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="chart"></g>
        <g
          className="legends"
          transform={`translate(-${(SVG_SIZE - padding) / 2}, ${
            (SVG_SIZE - padding) / 2 + LEGEND_HEIGHT
          })`}
          fontSize="0.2rem"
          fontWeight={600}
        ></g>
      </svg>
    </Box>
  );
}
