import * as d3 from "d3";
import { memo, useEffect, useMemo, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ChartElement, PieChartProps } from "../../interfaces/stats.model";
import { isPointInArc } from "../../utils/geometry";

const DEFAULT_MAX_WIDTH = "460px";
const LENGEND_ROW_HEIGHT = 6;
const BASE_RADIUS = 50;

function PieChart<T>({
  title,
  data,
  reuseColors,
  onArcInteraction,
  withDonut = true,
  gap = true,
  maxWidth = DEFAULT_MAX_WIDTH,
  labelLocation = "inside",
  innerLabelFitStrategy = "hide",
}: PieChartProps<ChartElement<T>[][]> & {
  onArcInteraction?: (data: T[]) => void;
}) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  const includeDonut = withDonut ? 0.5 : 0;
  const labels = useMemo(
    () => Array.from(new Set(data.flatMap((d) => d.map((g) => g.label)))),
    [data]
  );
  const color =
    reuseColors ??
    d3
      .scaleOrdinal<string>()
      .domain(labels)
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.7 + 0.2), labels.length)
          .reverse()
      );

  const legends = labelLocation === "legend" ? labels : [];
  const legendsHeight = legends.length * LENGEND_ROW_HEIGHT;

  useEffect(() => {
    const chart = d3.select(chartRef.current);
    const ringRadius = BASE_RADIUS / (data.length + includeDonut);

    chart
      .select(".legends")
      .selectAll(".legend")
      .data(legends)
      .join(
        (enter) => {
          const legend = enter
            .append("g")
            .attr("class", "legend")
            .attr(
              "transform",
              (_, i) => `translate(0,${i * LENGEND_ROW_HEIGHT})`
            );

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
            .attr("y", 3.5)
            .attr("fill", theme.palette.text.secondary)
            .text((d) => d);
          return legend;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    const pie = d3.pie<ChartElement<T>>().value((d) => d.count);

    data.forEach((ring, index) => {
      const innerRadius = (index + includeDonut) * ringRadius;
      const outerRadius = (index + 1 + includeDonut) * ringRadius;
      const arcs = pie(ring);
      const arc = d3
        .arc<d3.PieArcDatum<ChartElement<T>>>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

      function setLabelLocation(
        d: d3.PieArcDatum<ChartElement<T>>,
        i: number,
        nodes: SVGTextElement[] | d3.ArrayLike<SVGTextElement>
      ) {
        const box = nodes[i].getBBox();
        const arcData = {
          innerRadius,
          outerRadius,
          startAngle: arc.startAngle()(d),
          endAngle: arc.endAngle()(d),
        };
        const centroid = arc.centroid(d);
        const x = box.x + centroid[0];
        const y = box.y + centroid[1];
        const isInArc =
          isPointInArc({ x, y }, arcData) &&
          isPointInArc({ x: x + box.width, y }, arcData) &&
          isPointInArc({ x, y: y + box.height }, arcData) &&
          isPointInArc({ x: x + box.width, y: y + box.height }, arcData);
        if (!isInArc && index === data.length - 1) {
          const angle = (arc.startAngle()(d) + arc.endAngle()(d)) / 2;
          const translateX = Math.sin(angle) * (outerRadius + 3);
          const translateY = -Math.cos(angle) * (outerRadius + 3);
          d3.select(nodes[i])
            .attr("transform", `translate(${translateX}, ${translateY})`)
            .attr("text-anchor", translateX > 0 ? "start" : "end");
        } else if (!isInArc && innerLabelFitStrategy !== "show") {
          //TODO: need to show lengend when innerLabelFitStrategy = legend
          d3.select(nodes[i]).attr("fill", "transparent");
        } else {
          d3.select(nodes[i]).attr("transform", `translate(${centroid})`);
        }
      }

      chart
        .select(".chart")
        .selectAll(".ring" + index)
        .data(arcs)
        .join(
          (enter) => {
            const g = enter
              .append("g")
              .attr("class", "ring" + index)
              .on("mouseenter", (event, d) => {
                if (onArcInteraction) {
                  d3.select(event.currentTarget)
                    .style("cursor", "pointer")
                    .select("path")
                    .attr("fill", theme.palette.primary.main);
                  onArcInteraction(d.data.data);
                }
              })
              .on("mouseleave", (event, d) => {
                if (onArcInteraction) {
                  d3.select(event.currentTarget)
                    .style("cursor", "default")
                    .select("path")
                    .attr("fill", color(d.data.label));
                  onArcInteraction([]);
                }
              });
            g.append("path")
              .attr("stroke", "white")
              .attr("stroke-width", gap ? 1 : 0)
              .attr("fill", (d) => color(d.data.label))
              .attr("d", arc);

            g.append("text")
              .attr(
                "font-size",
                labelLocation === "inside" ? "0.25rem" : "0.35rem"
              )
              .attr("font-weight", "600")
              .attr("fill", theme.palette.text.secondary)
              .attr("text-anchor", "middle")
              .attr("style", "white-space:pre")
              .text(
                (d) =>
                  ` ${
                    labelLocation === "inside" ? d.data.label : d.data.count
                  } `
              )
              .each(setLabelLocation);

            return g;
          },
          (update) => {
            update.select("path").attr("d", arc);
            update
              .select("text")
              .text((d) =>
                labelLocation === "inside" ? d.data.label : d.data.count
              )
              .each(setLabelLocation as any);
            return update;
          },
          (exit) => exit.remove()
        );
    });
    const chartBox = (chart.select(".chart").node() as SVGGElement).getBBox();
    const svgWidth = Math.max(-chartBox.x, chartBox.x + chartBox.width) * 2;
    const svgHeight =
      Math.max(-chartBox.y, chartBox.y + chartBox.height) * 2 + legendsHeight;

    chart.attr(
      "viewBox",
      `-${svgWidth / 2} -${
        (svgHeight - legendsHeight) / 2
      } ${svgWidth} ${svgHeight}`
    );

    chart
      .select(".legends")
      .attr(
        "transform",
        `translate(-${svgWidth / 2}, ${(svgHeight - legendsHeight) / 2})`
      );
  }, [data]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: maxWidth || DEFAULT_MAX_WIDTH,
      }}
    >
      <Typography variant="h5" textAlign="center" mb={4}>
        {title}
      </Typography>
      <svg ref={chartRef}>
        <g className="chart"></g>
        <g className="legends" fontSize="0.25rem" fontWeight={600}></g>
      </svg>
    </Box>
  );
}

export default memo(PieChart) as typeof PieChart;
