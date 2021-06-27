import { ethers } from "ethers";
import React, { useState } from "react";
import WalletConnect from "@walletconnect/client";
import WalletConnectActions from "./WalletConnect";
import useNotifier from "../../hooks/useNotifier";
import { getUser } from "./api";
import { IAssetData } from "../../types/WalletConnect";
import { User as UserData } from "./types/User";
import { isMobile } from "../../utils/misc";

interface SavedUser {
  address: string;
  user?: UserData;
}

export interface UserDetails {
  user?: UserData | null;
  balance: number;
  address: string;
}

export type IUserContext = {
  user: UserDetails | null;
  getUser: (wallet: string) => Promise<UserData>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  mobileWalletConnect: WalletConnectActions | null;
  assets: IAssetData[];
  loading: boolean;
  signer: ethers.providers.JsonRpcSigner | null;
  provider: ethers.providers.Web3Provider | null;
};

export const UserContext = React.createContext<IUserContext>({
  user: null,
  getUser: () => undefined,
  connectWallet: () => undefined,
  disconnectWallet: () => undefined,
  mobileWalletConnect: null,
  assets: [],
  loading: false,
  signer: null,
  provider: null,
});

export const UserProvider: React.FC = ({ children }) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [assets, setAssets] = useState<IAssetData[] | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletConnector, setWalletConnector] = useState<WalletConnect | null>(
    null
  );

  const { notify } = useNotifier();
  const mobile = isMobile();

  React.useEffect(() => {
    const retrievedUser = localStorage.getItem("user");
    if (retrievedUser) {
      // if (!mobile) {
      //   getProvider();
      // }

      const savedUser: SavedUser = JSON.parse(retrievedUser);

      if (savedUser.address) {
        setUser(savedUser.user);
        setAddress(savedUser.address);
        getBalance().finally(() => {
          return;
        });
      }
    }
  }, []);

  React.useEffect(() => {
    if (provider) {
      setSigner(provider.getSigner());
      // getBalance();
    } else {
      if (!mobile) {
        getProvider();
      }
    }
  }, [provider]);

  const getProvider = () => {
    // @ts-ignore
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then(() => {
        setProvider(new ethers.providers.Web3Provider(window["ethereum"]));
      });
  };

  const resetApp = () => {
    setAddress(null);
    setBalance(null);
    setAssets(null);
    setChainId(null);
    setAccounts(null);
    setConnected(false);
    setWalletConnector(null);
  };

  const requestPermissions = async () => {
    // @ts-ignore
    await window?.ethereum?.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(0);
    localStorage.removeItem("user");
  };

  const connectWallet = async () => {
    try {
      // @ts-ignore
      window.ethereum.enable().then(
        setProvider(
          // @ts-ignore
          new ethers.providers.Web3Provider(window.ethereum)
        )
      );

      setSigner(provider?.getSigner());

      await requestPermissions();
      await getAccount();
    } catch (err) {
      notify({
        status: "info",
        title: "Connect MetaMask",
        text: "Please install MetaMask, to connect your wallet.",
      });
    }
  };

  const getAccount = async () => {
    // @ts-ignore
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // @ts-ignore
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x38",
          chainName: "BSC Mainnet",
          nativeCurrency: {
            name: "BSCMainnet",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: ["https://bsc-dataseed.binance.org"],
          blockExplorerUrls: ["https://bscscan.com"],
        },
        // {
        //   chainId: "0x61",
        //   chainName: "BSC Testnet",
        //   nativeCurrency: {
        //     name: "BSCTestnet",
        //     symbol: "BNB",
        //     decimals: 18,
        //   },
        //   rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        //   blockExplorerUrls: ["https://testnet.bscscan.com"],
        // },
      ],
    });

    const address = accounts[0];

    setAccounts(accounts);
    setAddress(address);

    if (address) {
      const user = await getUser(address);
      setUser(user);
      localStorage.setItem(
        "user",
        JSON.stringify({
          address,
          user,
        })
      );
    }

    // return await getBalance();
  };

  const getBalance = async () => {
    if (address) {
      let balance = await provider.getBalance(address);
      setBalance(parseFloat(ethers.utils.formatEther(balance)));
    }
  };

  const walletConnect = new WalletConnectActions(
    setWalletConnector,
    setConnected,
    setChainId,
    setAccounts,
    setAddress,
    setLoading,
    setAssets,
    resetApp
  );

  return (
    <UserContext.Provider
      value={{
        user: {
          user,
          balance,
          address,
        },
        getUser,
        connectWallet,
        disconnectWallet,
        mobileWalletConnect: walletConnect,
        assets,
        loading,
        signer,
        provider,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserContext.displayName = "UserContext";
export const User = UserContext.Consumer;
export default User;
