import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { IInternalEvent } from "@walletconnect/types";
import { IAssetData } from "../../types/WalletConnect";
import { apiGetAccountAssets } from "./api";

export default class WalletConnectActions {
  private setWalletConnector;
  private setConnected;
  private setChainId;
  private setAccounts;
  private setAddress;
  private setLoading;
  private setAssets;
  private resetApp;

  private connector;

  constructor(
    setWalletConnector: (value: React.SetStateAction<WalletConnect>) => void,
    setConnected: (value: React.SetStateAction<boolean>) => void,
    setChainId: (value: React.SetStateAction<number>) => void,
    setAccounts: (value: React.SetStateAction<string[]>) => void,
    setAddress: (value: React.SetStateAction<string>) => void,
    setLoading: (value: React.SetStateAction<boolean>) => void,
    setAssets: (value: React.SetStateAction<IAssetData[]>) => void,
    resetApp?: () => void
  ) {
    this.setWalletConnector = setWalletConnector;
    this.setConnected = setConnected;
    this.setChainId = setChainId;
    this.setAddress = setAddress;
    this.setAccounts = setAccounts;
    this.setLoading = setLoading;
    this.setAssets = setAssets;
    this.resetApp = resetApp;
  }

  async walletConnectInit() {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    this.connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    this.setWalletConnector(this.connector);

    // check if already connected
    if (!this.connector.connected) {
      // create new session
      await this.connector.createSession();
    }

    // subscribe to events
    await this.subscribeToEvents();
  }

  async subscribeToEvents() {
    if (!this.connector) {
      return;
    }

    this.connector.on("session_update", async (error, payload) => {
      // console.log(`connector.on("session_update")`);

      if (error) {
        throw error;
      }

      const { chainId, accounts } = payload.params[0];
      this.setChainId(chainId);
      this.setAccounts(accounts);
      this.setAddress(accounts[0]);
      await this.getAccountAssets(accounts[0], chainId);
    });

    this.connector.on("connect", (error, payload) => {
      // console.log(`connector.on("connect")`);

      if (error) {
        throw error;
      }

      this.onConnect(payload);
    });

    this.connector.on("disconnect", (error) => {
      // console.log(`connector.on("disconnect")`);

      if (error) {
        throw error;
      }

      this.onDisconnect();
    });

    if (this.connector.connected) {
      const { chainId, accounts } = this.connector;
      const address = accounts[0];
      this.setConnected(true);
      this.setChainId(chainId);
      this.setAccounts(accounts);
      this.setAddress(address);

      this.onSessionUpdate(accounts, chainId);
    }

    this.setWalletConnector(this.connector);
  }

  async onConnect(payload: IInternalEvent) {
    const { chainId, accounts } = payload.params[0];
    const address = accounts[0];

    this.setConnected(true);
    this.setChainId(chainId);
    this.setAccounts(accounts);
    this.setAddress(address);

    await this.getAccountAssets(address, chainId);
  }

  async onDisconnect() {
    this.resetApp();
  }

  async getAccountAssets(address: string, chainId: number) {
    this.setLoading(true);
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);

      this.setLoading(false);
      this.setAssets(assets);
    } catch (error) {
      console.error(error);
      this.setLoading(false);
    }
  }

  async killSession() {
    if (this.connector) {
      this.connector.killSession();
    }

    this.resetApp();
  }

  public onSessionUpdate = async (accounts: string[], chainId: number) => {
    const address = accounts[0];
    this.setChainId(chainId);
    this.setAccounts(accounts);
    this.setAddress(address);
    await this.getAccountAssets(address, chainId);
  };
}
