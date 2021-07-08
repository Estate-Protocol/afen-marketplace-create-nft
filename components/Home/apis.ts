import { NFT } from "../../types/NFT";
import { api as axios } from "../../utils/axios";

export type FetchNFTsFilter = Partial<
  Pick<NFT, "afenPrice" | "bnbPrice" | "wallet" | "canSell">
>;

export const fetchNFTs = async (
  pageNo: number,
  numPerPage?: number,
  filter?: FetchNFTsFilter,
  sort?: "DESC" | "ASC"
) => {
  const response = await axios.post("/nft/list", {
    pageNo,
    numPerPage: numPerPage || 50,
    filter: {
      isAuction: false,
      filter: { ...filter },
    },
    sort: {
      createdAt: sort === "DESC" ? -1 : 1,
    },
  });

  return response;
};
