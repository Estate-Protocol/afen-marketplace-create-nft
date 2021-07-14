import { NFT, NFTTransactionEnum } from "../../types/NFT";

import { api as axios } from "../../utils/axios";

export const updateNFT = async (data: Partial<NFT>, token?: string) => {
  const response = await axios.post("/nft/update", data, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });

  return response;
};

export const createTransaction = async (
  data: {
    userId: string;
    type: NFTTransactionEnum;
    nftId: string;
    price: number;
  },
  token?: string
) => {
  const response = await axios.post("/transaction/create", data, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });

  return response;
};
