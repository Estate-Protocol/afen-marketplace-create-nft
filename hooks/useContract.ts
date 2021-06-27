import { ContractContext } from "../components/Contract";
import { useContext } from "react";

function useContract() {
  return useContext(ContractContext);
}
export default useContract;
