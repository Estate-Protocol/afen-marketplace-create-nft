import { NFT } from "../../types/NFT";

import { api as axios } from "../../utils/axios";

export const updateNFT = async (data: Partial<NFT>, token?: string) => {
  const response = await axios.post("/nft/update", data, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });

  return response;
};
