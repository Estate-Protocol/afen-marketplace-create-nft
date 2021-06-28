import React, { useState } from "react";
import CreateFormPage, { CreateFormInput } from "../components/Create";
import ConnectWalletPage from "../components/User/ConnectWalletPage";
import { AfenNft } from "../contracts/types";
import { AFEN_NFT_ABI } from "../contracts/abis/AfenNFT";
import { BigNumber, ContractTransaction } from "ethers";
import { api } from "../utils/axios";
import useNotifier from "../hooks/useNotifier";
import useContract from "../hooks/useContract";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";
import { NFT } from "../types/NFT";

export interface CreateFormResponse {
  title?: string;
  text: string;
  status?: "error" | "success" | "info";
}

export default function Create() {
  const { contractSigned, setAbi } = useContract();
  const { user } = useUser();
  const { notify } = useNotifier();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<CreateFormResponse | null>(null);

  setAbi(AFEN_NFT_ABI);

  const saveNFT = async (data: CreateFormInput): Promise<NFT> => {
    let formData = new FormData();
    formData.append("file", data.upload);
    formData.append("title", data.title);
    formData.append("royalty", data.royalty.toString());
    formData.append("description", data.description);
    formData.append("afenPrice", data.afenPrice.toString());
    formData.append("bnbPrice", data.bnbPrice.toString());
    formData.append("wallet", user?.address);
    const response = await api.post("/nft/create/", formData, {
      headers: {
        "Content-type": "multipart/form-data",
        type: "formData",
      },
    });

    if (response.status === 200) {
      setMessage({
        text: "Art Saved",
        status: "success",
      });
    }

    return response.data.nft;
  };

  const createNFT = async (
    nft: NFT,
    afen,
    bnb,
    contract: AfenNft
  ): Promise<ContractTransaction & { nft_id: string }> => {
    const priceA = BigNumber.from(afen);
    const priceB = BigNumber.from(bnb);
    const value = await contract.create_nft(nft.fileHash, priceA, priceB);

    if (value.hash) {
      setTimeout(() => {
        setMessage({
          status: "info",
          text: "Minting NFT...",
        });
      }, 3000);
    }

    // @ts-ignore
    return value;
  };

  const mintNFT = async (
    nftId: string,
    price,
    selectedCurrency: number,
    contract: AfenNft
  ): Promise<ContractTransaction> => {
    price = BigNumber.from(price);
    const mint = await contract.mint(nftId, price, selectedCurrency);

    if (mint.hash) {
      setMessage({
        text: "Congratulation, NFT created.",
        status: "success",
      });
    }

    return mint;
  };

  const handleSubmit = async (data: CreateFormInput) => {
    setLoading(true);
    try {
      const nftContract = contractSigned as AfenNft;

      let price = 0;

      if (data.currencySelected === "AFEN") {
        data.bnbPrice = 0;
        price = data.afenPrice;
      } else {
        data.afenPrice = 0;
        price = data.bnbPrice;
      }

      const nft = await saveNFT(data);

      if (nft) {
        const createdNft = await createNFT(
          nft,
          data.afenPrice,
          data.bnbPrice,
          nftContract
        );

        if (createdNft.hash) {
          // update nftId
          // const response = await api.post(
          //   "/nft/update/",
          //   // @ts-ignore
          //   { nftId: value.nft_id },
          // );

          // const mintedNFT = await mintNFT(
          //   createdNft.nft_id,
          //   price,
          //   data.currencySelected === "AFEN" ? 0 : 1,
          //   nftContract
          // );

          // if (mintedNFT) {
          // notify({
          //   status: "success",
          //   title: "Done!",
          //   text: "Your NFT had been minted",
          // });
          router.push(`/nft/${nft?._id}`);
          // }
        }
      }
    } catch (err) {
      if (err.code === 4001) {
        notify({
          title: "Cancelled",
          status: "error",
          text: "To create NFT please accept the request by clicking confirm when MetaMask dialog popups",
        });
      } else {
        notify({
          title: "Sorry",
          status: "error",
          text: "An error occured while trying to create NFT, please again later",
        });
      }
      console.log(err);
    }
    setLoading(false);
  };

  return user?.address ? (
    <CreateFormPage
      onSubmit={handleSubmit}
      wallet={user?.address}
      loading={loading}
      message={message}
    />
  ) : (
    <ConnectWalletPage />
  );
}
