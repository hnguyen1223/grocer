import { capitalize } from "@mui/material";
import { BaseLog, Stuff } from ".";
import dayjs from "dayjs";
import { getExpiryDate } from "../utils";

export type GroupingFn<T> = (item: T) => string;
export type DataGrouping<T> = { groupFn: GroupingFn<T>, name: string }
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

export const STUFF_EXPIRY_GROUPINGS: DataGrouping<Stuff>[] = [
    {
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
    },
]


export const LOG_GROUPINGS: DataGrouping<BaseLog>[] = [
    { name: "category", groupFn: (log) => log.model },
];
