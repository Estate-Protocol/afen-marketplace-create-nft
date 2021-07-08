import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ethers } from "ethers";
import { MAIN_ABI } from "../../contracts/abis/Main";
import useUser from "../../hooks/useUser";

export type IContractContext = {
  contract: ethers.Contract | null;
  contractSigned: any;
  setAbi: Dispatch<SetStateAction<{ [key: string]: any }[]>>;
};

export const ContractContext = React.createContext<IContractContext>({
  contract: null,
  contractSigned: null,
  setAbi: () => undefined,
});

export const ContractProvider: React.FC = ({ children }) => {
  const [abi, setAbi] = useState<{ [key: string]: any }[] | null>(null);
  const [contract, setContract] = useState(null);
  const [contractSigned, setContractSigned] = useState(null);

  const { signer } = useUser();

  const chainAddress =
    process.env.CHAIN_ADDRESS || "0x3F6A1eB55c7fb12177b940385556AfC4Cc83140b";
  const provider = ethers.getDefaultProvider();
  // const signer = ethers.Wallet.createRandom().connect(provider);

  if (!abi) {
    setAbi(MAIN_ABI);
  }

  useEffect(() => {
    // Read-Only; By connecting to a Provider, allows:
    // - Any constant function
    // - Querying Filters
    // - Populating Unsigned Transactions for non-constant methods
    // - Estimating Gas for non-constant (as an anonymous sender)
    // - Static Calling non-constant methods (as anonymous sender)
    setContract(new ethers.Contract(chainAddress, abi, provider));

    // Read-Write; By connecting to a Signer, allows:
    // - Everything from Read-Only (except as Signer, not anonymous)
    // - Sending transactions for non-constant functions
    setContractSigned(new ethers.Contract(chainAddress, abi, signer));
  }, [abi, signer]);

  return (
    <ContractContext.Provider value={{ contract, contractSigned, setAbi }}>
      {children}
    </ContractContext.Provider>
  );
};

ContractContext.displayName = "ContractContext";
export const Contract = ContractContext.Consumer;
export default Contract;
