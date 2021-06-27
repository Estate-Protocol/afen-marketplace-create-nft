import { UserContext } from "../components/User";
import { useContext } from "react";

function useUser() {
  return useContext(UserContext);
}
export default useUser;
