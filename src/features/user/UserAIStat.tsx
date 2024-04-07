import DataDisplay from "../../shared/components/DataDisplay";
import { useWeeklyUsage } from "../../shared/hooks/stats";

const USER_LIMIT = 300;
export default function UserAIStat() {
  const { weeklyUsage } = useWeeklyUsage();
  return (
    <DataDisplay
      label="Weekly Requests"
      data={`${weeklyUsage} / ${USER_LIMIT}`}
    ></DataDisplay>
  );
}
