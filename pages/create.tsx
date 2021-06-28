import React, { useState } from "react";
import CreateFormPage, { CreateFormInput } from "../components/Create";
import ConnectWalletPage from "../components/User/ConnectWalletPage";
import { AfenNft } from "../contracts/types";
import { AFEN_NFT_ABI } from "../contracts/abis/AfenNFT";
import { BigNumber } from "ethers";
import { api } from "../utils/axios";
import useNotifier from "../hooks/useNotifier";
import useContract from "../hooks/useContract";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";

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

  const createNFT = async (data: CreateFormInput) => {
    setLoading(true);
    const nftContract = contractSigned as AfenNft;

    if (data.currencySelected === "AFEN") {
      data.bnbPrice = 0;
    } else {
      data.afenPrice = 0;
    }

    let formData = new FormData();
    formData.append("file", data.upload);
    formData.append("title", data.title);
    formData.append("royalty", data.royalty.toString());
    formData.append("description", data.description);
    formData.append("afenPrice", data.afenPrice.toString());
    formData.append("bnbPrice", data.bnbPrice.toString());
    formData.append("wallet", user?.address);

    try {
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

        const priceA = BigNumber.from(data.afenPrice);
        const priceB = BigNumber.from(data.bnbPrice);

        const value = await nftContract.create_nft(
          response.data.nft.fileHash,
          priceA,
          priceB
        );

        if (value.hash) {
          setMessage({
            text: "Congratulation, NFT created.",
            status: "success",
          });
          setTimeout(() => {
            setMessage({
              text: "Minting NFT...",
              status: "info",
            });
          }, 3000);

          // nftContract.mint(value.chainId, priceA, value.blockNumber);
        }

        router.push(`/nft/${response?.data?.nft._id}`);
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
      onSubmit={createNFT}
      wallet={user?.address}
      loading={loading}
      message={message}
    />
  ) : (
    <ConnectWalletPage />
  );
}
