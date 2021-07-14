import React, { useState } from "react";
import CreateFormPage, { CreateFormInput } from "../components/Create";
import { Nft } from "../contracts/types";
import { NFT_ABI } from "../contracts/abis/Nft";
import { BigNumber, ContractTransaction } from "ethers";
import { api } from "../utils/axios";
import useNotifier from "../hooks/useNotifier";
import useContract from "../hooks/useContract";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";
import { NFT, NFTStatusEnum } from "../types/NFT";
import useAuth from "../hooks/useAuth";
import withAuth from "../components/HOC/withAuth";
import { messages } from "../constants/messages";
import cookieCutter from "cookie-cutter";
import { authCookieName } from "../components/Auth/apis/auth";
import { updateNFT } from "../components/NFT/apis";

export interface CreateFormResponse {
  title?: string;
  text: string;
  status?: "error" | "success" | "info";
}

export const Create: React.FC = () => {
  const { contractSigned, setAbi } = useContract();
  const { user, connectWallet } = useUser();
  const { notify } = useNotifier();
  const { isAuthenticated, toggleLoginDialog, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<CreateFormResponse | null>(null);

  const token = cookieCutter.get(authCookieName);

  React.useEffect(() => {
    setAbi(NFT_ABI);
  }, []);

  const saveNFT = async (data: CreateFormInput): Promise<NFT> => {
    const userId = localStorage.getItem("userId");

    let formData = new FormData();
    formData.append("file", data.upload);
    formData.append("title", data.title);
    formData.append("royalty", data.royalty.toString());
    formData.append("description", data.description);
    formData.append("afenPrice", data.afenPrice.toString());
    formData.append("bnbPrice", data.bnbPrice.toString());
    formData.append("creatorId", userId);

    try {
      const response = await api.post("/nft/create/", formData, {
        headers: {
          "Content-type": "multipart/form-data",
          type: "formData",
          Authorization: `JWT ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage({
          text: "Art Saved",
          status: "success",
        });
      }

      return response.data.nft;
    } catch (err) {
      setLoading(false);
      if (err?.response?.status === 401) {
        notify(messages.sessionExpired);
        logout();
      } else if (err?.response?.status === 422) {
        notify(messages.nftExists);
      } else {
        notify(messages.somethingWentWrong);
      }
    }
  };

  const createNFT = async (
    nft: NFT,
    afen,
    bnb,
    contract: Nft
  ): Promise<ContractTransaction & { nft_id: string }> => {
    const priceA = BigNumber.from(afen);
    const priceB = BigNumber.from(bnb);

    const value = await contract.create_nft(nft.fileHash, priceA, priceB);
    const nft_id = await contract.get_nft_list_size();

    if (value.hash) {
      setTimeout(() => {
        setMessage({
          status: "info",
          text: "Minting NFT...",
        });
      }, 3000);
    }

    // @ts-ignore
    return { ...value, nft_id: nft_id.toString() };
  };

  const handleSubmit = async (data: CreateFormInput) => {
    if (!isAuthenticated) {
      return toggleLoginDialog(true);
    }

    if (!user.address) {
      return notify({
        ...messages.connectWallet,
        action: {
          text: "Connect Wallet",
          onClick: connectWallet,
        },
      });
    }

    setLoading(true);
    const nftContract = contractSigned as Nft;

    let price = 0;

    if (data.currencySelected === "AFEN") {
      data.bnbPrice = 0;
      price = data.afenPrice;
    } else {
      data.afenPrice = 0;
      price = data.bnbPrice;
    }

    const nft = await saveNFT(data);

    const handleSomethingWentWrongArtSaved = {
      onClick: () => router.push(`/nft/${nft._id}`),
      text: "View Art",
    };

    try {
      if (nft) {
        const createdNft = await createNFT(
          nft,
          data.afenPrice,
          data.bnbPrice,
          nftContract
        );

        if (createdNft.hash && nft) {
          // update nftId and status
          await updateNFT(
            {
              _id: nft._id,
              nftId: parseInt(createdNft.nft_id),
              status: NFTStatusEnum.CREATED,
            },
            token
          )
            .then(() => {
              notify({
                status: "success",
                title: "Done!",
                text: "Your NFT had been created",
                action: {
                  onClick: () => router.push(`/nft/${nft?._id}`),
                  text: "View NFT",
                },
              });
            })
            .catch(() => {
              notify({
                ...messages.somethingWentWrongArtSaved,
                action: handleSomethingWentWrongArtSaved,
              });
            });
        }
      }
    } catch (err) {
      setLoading(false);
      if (err.code === 4001) {
        notify({
          ...messages.requestCancelledArtSaved,
          action: handleSomethingWentWrongArtSaved,
        });
      } else if ((err.code = "NETWORK_ERROR")) {
        notify({
          ...messages.walletNetworkErrorArtSaved,
          action: handleSomethingWentWrongArtSaved,
        });
      } else if (err?.response?.status === 401) {
        notify(messages.sessionExpired);
        logout();
      } else {
        notify({
          ...messages.somethingWentWrongArtSaved,
          action: handleSomethingWentWrongArtSaved,
        });
      }
    }
  };

  return (
    isAuthenticated && (
      <CreateFormPage
        onSubmit={handleSubmit}
        user={user}
        wallet={user?.address}
        loading={loading}
        message={message}
      />
    )
  );
};

export default withAuth(Create);
