import { useContext } from "react";
import {
  CreateModalContext,
  CreateModalTogglerContext,
} from "../../core/CreateStuffProvider";

export default function StuffModal() {
  const isModalShown = useContext(CreateModalContext);
  const setIsModalShown = useContext(CreateModalTogglerContext);
}
