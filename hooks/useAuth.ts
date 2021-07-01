import { AuthContext } from "../components/Auth/AuthProvider";
import { useContext } from "react";

function useAuth() {
  return useContext(AuthContext);
}
export default useAuth;
