import { capitalize } from "@mui/material";
import { BaseLog, Stuff } from ".";
import dayjs from "dayjs";
import { getExpiryDate } from "../utils";

export type GroupingFn<T> = (item: T) => string;
export type DataGrouping<T> = { groupFn: GroupingFn<T>; name: string };
export interface ChartElement<T> {
  data: T[];
  count: number;
  label: string;
  group: string;
}

// TODO: use configurable groupings
export const STUFF_CATEGORY_GROUPINGS: DataGrouping<Stuff>[] = [
  { name: "location", groupFn: (stuff) => capitalize(stuff.location) },
  { name: "category", groupFn: (stuff) => stuff.category },
];

export const STUFF_EXPIRY_GROUPING: DataGrouping<Stuff> = {
  name: "expiry",
  groupFn: (stuff) => {
    const today = dayjs(new Date());
    const expiryDate = getExpiryDate(stuff);
    return today.isAfter(expiryDate) && today.diff(expiryDate, "d") !== 0
      ? "expired"
      : Math.abs(today.diff(expiryDate, "d")) < 3
      ? "< 3 days"
      : "later";
  },
};
export const LOG_GROUPINGS: DataGrouping<BaseLog>[] = [
  { name: "category", groupFn: (log) => log.model },
];

export function groupElement<T>(
  array: T[],
  grouping: DataGrouping<T>
): ChartElement<T>[] {
  return Object.values(
    array.reduce((acc: { [key: string]: ChartElement<T> }, item) => {
      const label = grouping.groupFn(item);
      acc[label] = acc[label] || {
        data: [],
        count: 0,
        label,
        group: grouping.name,
      };
      acc[label].data.push(item);
      acc[label].count++;
      return acc;
    }, {})
  );
}

export function getStats<T>(
  items: T[],
  groupings: DataGrouping<T>[]
): ChartElement<T>[][] {
  return groupings.reduce((data: ChartElement<T>[][], grouping, index) => {
    const currentGroupData = (data[index - 1] ?? [{ data: items }]).flatMap(
      (element) => groupElement(element.data, grouping)
    );
    data.push(currentGroupData);
    return data;
  }, []);
}

export interface BaseChartProps<T> {
  title?: string;
  data: T;
  reuseColors?: d3.ScaleOrdinal<string, string>;
  maxWidth?: string;
}

export interface PieChartProps<T> extends BaseChartProps<T> {
  withDonut?: boolean;
  gap?: boolean;
  labelLocation?: "legend" | "inside";
  innerLabelFitStrategy?: "hide" | "show" | "legend"; //only matters when labelLocation is inside
}

export interface BarChartProps<T> extends BaseChartProps<T> {
  background?: boolean;
}
