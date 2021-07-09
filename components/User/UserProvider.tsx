import { ethers } from "ethers";
import React, { useState } from "react";
import WalletConnect from "@walletconnect/client";
import WalletConnectActions from "./WalletConnect";
import useNotifier from "../../hooks/useNotifier";
import { getUser } from "./api";
import { IAssetData } from "../../types/WalletConnect";
import { User as UserData } from "./types/User";
import { isMobile } from "../../utils/misc";
import { messages } from "../../constants/messages";
import useAuth from "../../hooks/useAuth";
import { authCookieName } from "../Auth/apis/auth";
import cookieCutter from "cookie-cutter";
// import detectEthereumProvider from "@metamask/detect-provider";

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
  setUser: (data: UserData) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnectingWallet: boolean;
  mobileWalletConnect: WalletConnectActions | null;
  assets: IAssetData[];
  loading: boolean;
  signer: ethers.providers.JsonRpcSigner | null;
  provider: ethers.providers.Web3Provider | null;
};

export const UserContext = React.createContext<IUserContext>({
  user: null,
  setUser: () => undefined,
  connectWallet: () => undefined,
  disconnectWallet: () => undefined,
  isConnectingWallet: false,
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
  const [isConnectingWallet, setConnectingWallet] = useState(false);
  const [walletConnector, setWalletConnector] = useState<WalletConnect | null>(
    null
  );

  const { notify } = useNotifier();
  const mobile = isMobile();
  const { isAuthenticated, logout } = useAuth();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token =
    typeof window !== "undefined" ? cookieCutter.get(authCookieName) : null;

  React.useEffect(() => {
    if (userId) {
      getUser(userId, token)
        .then((response) => {
          setUser(response);
          setAddress(response.wallet);
        })
        .catch((err) => {
          if (err?.response.status === 401) {
            logout();
          }
        });
    }
  }, [userId, isAuthenticated]);

  React.useEffect(() => {
    if (userId && isAuthenticated) {
      // @ts-ignore
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(() => {
          setProvider(new ethers.providers.Web3Provider(window["ethereum"]));
        })
        .catch(() => {
          notify(messages.walletConnectionError);
        });
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (provider) {
      setSigner(provider.getSigner());
      getBalance();
    }
  }, [provider]);

  const getProvider = () => {
    try {
      // @ts-ignore
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(() => {
          setProvider(new ethers.providers.Web3Provider(window["ethereum"]));
        });
    } catch (err) {
      notify(messages.walletConnectionError);
    }
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
      if (!window.ethereum.isMetaMask) {
        throw new Error("Install MetaMask");
      }

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
      notify(messages.walletConnectionError);
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
        // {
        //   chainId: "0x38",
        //   chainName: "BSC Mainnet",
        //   nativeCurrency: {
        //     name: "BSCMainnet",
        //     symbol: "BNB",
        //     decimals: 18,
        //   },
        //   rpcUrls: ["https://bsc-dataseed.binance.org"],
        //   blockExplorerUrls: ["https://bscscan.com"],
        // },
        {
          chainId: "0x61",
          chainName: "BSC Testnet",
          nativeCurrency: {
            name: "BSCTestnet",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
          blockExplorerUrls: ["https://testnet.bscscan.com"],
        },
      ],
    });

    const address = accounts[0];

    setAccounts(accounts);
    setAddress(address);

    return await getBalance();
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
        setUser: (data: UserData) => {
          setUser(data);
        },
        connectWallet,
        disconnectWallet,
        isConnectingWallet,
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
