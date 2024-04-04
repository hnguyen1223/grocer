import { useLocalStorage } from "react-use";
import ModalLayout from "../../shared/components/ModalLayout";
import UserInfo from "./UserInfo";
import { useCallback, useContext, useEffect } from "react";
import {
  SetUserModalContext,
  UserModalContext,
} from "../../core/UserModalProvider";

export default function UserModal() {
  const [shownWelcome, setShownWelcome] =
    useLocalStorage<boolean>("shownWelcome");
  const open = useContext(UserModalContext);
  const setModalOpen = useContext(SetUserModalContext);
  const handleGuestSignIn = useCallback(
    () => setModalOpen(false),
    [setModalOpen]
  );

  useEffect(() => {
    if (!shownWelcome) {
      setShownWelcome(true);
      setModalOpen(true);
    }
  }, []);
  return (
    <ModalLayout open={open} onClose={() => setModalOpen(!open)}>
      <UserInfo onGuestSignIn={handleGuestSignIn}></UserInfo>
    </ModalLayout>
  );
}
