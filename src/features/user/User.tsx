import { useMemo, useState } from "react";
import ModalLayout from "../../shared/components/ModalLayout";
import UserInfo from "./UserInfo";
import UserAvatar from "./UserAvatar";

export default function User() {
  const [isOpened, setIsOpened] = useState(false);
  const open = useMemo(() => () => setIsOpened(true), []);
  return (
    <>
      <UserAvatar onClick={open}></UserAvatar>
      <ModalLayout open={isOpened} onClose={() => setIsOpened(!isOpened)}>
        <UserInfo></UserInfo>
      </ModalLayout>
    </>
  );
}
