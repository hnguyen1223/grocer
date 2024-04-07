import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Typography, useTheme } from "@mui/material";
import { ChartElement } from "../../shared/interfaces/stats.model";

const SVG_SIZE = 100;
const PADDING = 10;

export default function PieChart<T>({
  title,
  data,
}: {
  title: string;
  data: ChartElement<T>[][];
}) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const idRef = useRef<string>(uuidv4());
  const theme = useTheme();

  const labels = data.flatMap((d) => d.map((g) => g.label));
  useEffect(() => {
    const ringRadius = (SVG_SIZE - PADDING) / 2 / (data.length + 0.5);
    const color = d3
      .scaleOrdinal<string>()
      .domain(labels)
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.7 + 0.1), labels.length)
          .reverse()
      );
    const pie = d3
      .pie<ChartElement<T>>()
      .sort(null)
      .value((d) => d.count);

    data.forEach((ring, index) => {
      const arcs = pie(ring);
      const arc = d3
        .arc<d3.PieArcDatum<ChartElement<T>>>()
        .innerRadius((index + 0.5) * ringRadius)
        .outerRadius((index + 1.5) * ringRadius);

      d3.select(chartRef.current)
        .select(".chart")
        .selectAll(".ring" + index)
        .data(arcs)
        .join("path")
        .attr("class", "ring" + index)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill", (d) => color(d.data.label))
        .attr("d", arc);

      d3.select(chartRef.current)
        .select(".chart")
        .selectAll(".text" + index)
        .data(arcs)
        .join("text")
        .attr("class", "text" + index)
        .attr("transform", (d) => {
          const [x, y] = arc.centroid(d);
          return `translate(${x}, ${y})`;
        })
        .attr("font-size", "0.15rem")
        .attr("font-weight", "600")
        .attr("fill", theme.palette.text.secondary)
        .attr("text-anchor", "middle")
        .text((d) => d.data.label);
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
        viewBox={`${-SVG_SIZE / 2} ${-SVG_SIZE / 2} ${SVG_SIZE} ${SVG_SIZE}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="chart"></g>
      </svg>
    </Box>
  );
}
