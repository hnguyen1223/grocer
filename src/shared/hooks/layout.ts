import { useOrientation } from "react-use";

export default function useIsHorizontal(): boolean {
  const orientation = useOrientation();
  return orientation.angle === 90 || orientation.angle === 270;
}
