import { useUsageStats } from "../../shared/hooks";
import DataDisplay from "../../shared/components/DataDisplay";

const USER_LIMIT = 300;
export default function UserAIStat() {
  const { weeklyUsage } = useUsageStats();
  return (
    <DataDisplay
      label="Weekly Requests"
      data={`${weeklyUsage} / ${USER_LIMIT}`}
    ></DataDisplay>
  );
}
