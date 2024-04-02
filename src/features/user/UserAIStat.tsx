import { useUsageStats } from "../../shared/hooks";
import DataDisplay from "../../shared/components/DataDisplay";

const USER_LIMIT = 200;
const GUEST_LIMIT = 50;
const REQUEST_PER_ITEM = 5;
export default function UserAIStat() {
  const [weeklyUsage] = useUsageStats();
  return (
    <DataDisplay
      label="Weekly Usage"
      data={`${weeklyUsage / REQUEST_PER_ITEM} /${
        USER_LIMIT / REQUEST_PER_ITEM
      }`}
    ></DataDisplay>
  );
}
