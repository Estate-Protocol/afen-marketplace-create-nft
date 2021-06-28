export interface NFT {
  isAuction: boolean;
  minimunBid: number;
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}
