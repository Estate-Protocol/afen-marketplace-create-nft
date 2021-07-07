import { BaseType } from "./BaseType";
import { User } from "./User";

export interface NFT extends BaseType {
  isAuction: boolean;
  minimunBid: number;
  fileHash: string;
  path?: string;
  title: string;
  description: string;
  wallet: string;
  afenPrice: number;
  bnbPrice: number;
  price: number;
  width?: number;
  height?: number;
  depth?: number;
  nftId: number;
  user: User;
}

export interface NFTTransaction extends BaseType {
  user: User;
  type?: NFTTransactionEnum;
  nft: NFT;
  price: number;
}

export interface NFTTransactionEnum {
  BUY: "BUY";
  SELL: "SELL";
  BID: "BID";
}
