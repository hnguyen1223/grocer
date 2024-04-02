import dayjs from "dayjs";
import { Stuff } from "../interfaces";

export function getExpiryDate(stuff: Stuff): dayjs.Dayjs {
  return stuff.expiryDate
    ? dayjs(stuff.expiryDate)
    : stuff.durabilities[stuff.location]?.days
    ? dayjs(stuff.dateAdded).add(
        stuff.durabilities[stuff.location]!.days,
        "day"
      )
    : stuff.durabilities[stuff.location]?.hours
    ? dayjs(stuff.dateAdded).add(
        stuff.durabilities[stuff.location]!.hours,
        "hour"
      )
    : dayjs(stuff.dateAdded);
}
