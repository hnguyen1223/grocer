import { memo, useEffect, useState } from "react";
import ModalLayout from "../../shared/components/ModalLayout";
import UserInfo from "./UserInfo";
import UserAvatar from "./UserAvatar";
import { useLocalStorage } from "react-use";

const User = memo(function User() {
  console.log("User");
  const [shownWelcome, setShownWelcome] =
    useLocalStorage<boolean>("shownWelcome");
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (!shownWelcome) {
      setShownWelcome(true);
      setIsOpened(true);
    }
  }, []);

  return (
    <>
      <UserAvatar onClick={() => setIsOpened(true)}></UserAvatar>
      <ModalLayout open={isOpened} onClose={() => setIsOpened(!isOpened)}>
        <UserInfo onGuestSignIn={() => setIsOpened(false)}></UserInfo>
      </ModalLayout>
    </>
  );
});
export default User;
