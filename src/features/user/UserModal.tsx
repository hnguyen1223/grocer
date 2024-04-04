import { useLocalStorage } from "react-use";
import ModalLayout from "../../shared/components/ModalLayout";
import UserInfo from "./UserInfo";
import { useContext, useEffect } from "react";
import {
  SetUserModalContext,
  UserModalContext,
} from "../../core/UserModalProvider";

export default function UserModal() {
  const [shownWelcome, setShownWelcome] =
    useLocalStorage<boolean>("shownWelcome");
  const open = useContext(UserModalContext);
  const setModalOpen = useContext(SetUserModalContext);

  useEffect(() => {
    if (!shownWelcome) {
      setShownWelcome(true);
      setModalOpen(true);
    }
  }, []);
  return (
    <ModalLayout open={open} onClose={() => setModalOpen(!open)}>
      <UserInfo onGuestSignIn={() => setModalOpen(false)}></UserInfo>
    </ModalLayout>
  );
}
