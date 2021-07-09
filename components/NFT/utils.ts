import { ContractTransaction, BigNumber } from "ethers";
import { Nft } from "../../contracts/types";
import { NFT } from "../../types/NFT";

export const mintNFT = async (
  nftId: number,
  price: number,
  selectedCurrency: number,
  contract: Nft,
  onCompleted?: (mint: ContractTransaction) => void,
  onError?: (err: any) => void
): Promise<ContractTransaction> => {
  try {
    const bigNumberPrice = BigNumber.from(price);
    const mint = await contract.mint(nftId, bigNumberPrice, selectedCurrency);

    if (mint.hash) {
      onCompleted(mint);
    }

    return mint;
  } catch (err) {
    onError(err);
  }
};

export const createNFT = async (
  nft: NFT,
  contract: Nft,
  onCompleted?: (mint: ContractTransaction) => void,
  onError?: (err: any) => void
): Promise<ContractTransaction & { nft_id: string }> => {
  try {
    const priceA = BigNumber.from(nft.afenPrice);
    const priceB = BigNumber.from(nft.bnbPrice);

    const value = await contract.create_nft.call(
      this,
      nft.fileHash,
      priceA,
      priceB
    );
    const nftId = await contract.get_nft_list_size();

    if (value.hash) {
      onCompleted(value);
    }

    // @ts-ignore
    return value;
  } catch (err) {
    onError(err);
  }
};
