import { NotifcationContext } from "../components/Notification";
import { useContext } from "react";

function useNotifier() {
  return useContext(NotifcationContext);
}
export default useNotifier;
