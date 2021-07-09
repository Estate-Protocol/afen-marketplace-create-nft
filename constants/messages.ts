import { NotificationDataStatusEnum } from "../components/Notification";

export const messages = {
  walletNetworkError: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Wrong Network",
    text: "Please change network",
  },
  walletNetworkErrorArtSaved: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Wrong Network",
    text: "Please change network. Do not worry, you art has been saved. Please try again later",
  },
  networkError: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Network Error",
    text: "Please check your connection",
  },
  walletConnectionError: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Connect MetaMask",
    text: "Please install MetaMask, to connect your wallet.",
  },
  transactionError: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Try Again",
    text: "We are having issues processing your request, please try again",
  },
  insufficientFundsError: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Insufficient Funds",
    text: "Please fund your account, then try again",
  },
  somethingWentWrong: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Something went wrong",
    text: "It is not you, it us. Please try again",
  },
  somethingWentWrongArtSaved: {
    status: NotificationDataStatusEnum.ERROR,
    title: "Could not create NFT",
    text: "Do not worry, you art has been saved. Please try again later",
  },
  connectWallet: {
    status: NotificationDataStatusEnum.INFO,
    title: "Connect Wallet",
    text: "To buy an NFT, we need you to connect your wallet",
  },
  requestCancelled: {
    status: NotificationDataStatusEnum.INFO,
    title: "Action cancelled",
    text: "Try again to initiate action",
  },
  requestCancelledArtSaved: {
    status: NotificationDataStatusEnum.INFO,
    title: "Action cancelled",
    text: "Try again to initiate action. Do not worry, you art has been saved. Please try again later",
  },
  savedChanges: {
    status: NotificationDataStatusEnum.SUCCESS,
    title: "Saved changes",
    text: "All good, changes have been saved",
  },
  sessionExpired: {
    status: NotificationDataStatusEnum.INFO,
    title: "Session expired",
    text: "Please login",
  },
  nftExists: {
    status: NotificationDataStatusEnum.ERROR,
    title: "NFT exists",
    text: "An NFT with this image already exist, please use another image.",
  },
  minted: {
    status: NotificationDataStatusEnum.SUCCESS,
    title: "Done!",
    text: "This NFT is now available for sale on the Marketplace",
  },
};
