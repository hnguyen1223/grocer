import { memo, useState } from "react";
import ModalLayout from "../../shared/components/ModalLayout";
import UserInfo from "./UserInfo";
import UserAvatar from "./UserAvatar";

const User = memo(function User() {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <UserAvatar onClick={() => setIsOpened(true)}></UserAvatar>
      <ModalLayout open={isOpened} onClose={() => setIsOpened(!isOpened)}>
        <UserInfo></UserInfo>
      </ModalLayout>
    </>
  );
});
export default User;
