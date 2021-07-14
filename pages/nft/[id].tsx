import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { api } from "../../utils/axios";
import {
  NFT,
  NFTStatusEnum,
  NFTTransaction,
  NFTTransactionEnum,
} from "../../types/NFT";
import { ButtonType } from "../../components/IO/Button";
import useUser from "../../hooks/useUser";
import useContract from "../../hooks/useContract";
import useAuth from "../../hooks/useAuth";
import useNotifier from "../../hooks/useNotifier";
import { messages } from "../../constants/messages";
import { createNFT, mintNFT } from "../../components/NFT/utils";
import { Nft } from "../../contracts/types";
import { NFT_ABI } from "../../contracts/abis/Nft";
import { createTransaction, updateNFT } from "../../components/NFT/apis";
import { logout } from "../../components/Auth/apis/auth";
import { reloadPage } from "../../utils";
import { NFTImage } from "../../components/NFT/NFTImage";
import NFTDetails from "../../components/NFT/NFTDetails";
import { copyToClipboard } from "../../utils/misc";

interface NFTPageProps {
  nft: NFT;
  transactions: NFTTransaction[];
}

// getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await api.post("/nft/list", {
    pageNo: 1,
    numPerPage: 5000,
    filter: {
      isAuction: false,
      price: "",
    },
  });

  const NFTs: NFT[] = response?.data.list || [];

  const paths = NFTs.map(({ _id }) => ({
    params: {
      id: _id,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { id } = params;

  try {
    const response = await api.get(`nft/${id}`);
    const nft: NFT = response.data.nft;
    if (nft) {
      const transactionsResponse = await api.post("/transaction/list", {
        pageNo: 1,
        numPerPage: 10,
        filter: {
          _id: nft._id,
        },
      });

      let transactions = transactionsResponse?.data.list || [];

      return { props: { nft, transactions }, revalidate: 1 };
    } else {
      return { notFound: true };
    }
  } catch (err) {
    return { notFound: true };
  }
};

export default function Token({ nft, transactions }: NFTPageProps) {
  const { isFallback } = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [shareDialog, setShareDialog] = React.useState(false);
  const { user, connectWallet } = useUser();
  const { authToken, isAuthenticated, toggleLoginDialog } = useAuth();
  const { setAbi, contractSigned } = useContract();
  const { notify } = useNotifier();

  const isOwner = isAuthenticated && user?.user?._id === nft?.owner?._id;
  const canSell = nft?.status === NFTStatusEnum.MINTED && nft?.canSell;

  React.useEffect(() => {
    setAbi(NFT_ABI);
  }, []);

  const getPrice = () => {
    let price = {
      currency: "AFEN",
      amount: nft?.afenPrice,
    };

    if (nft?.afenPrice === 0) {
      price = {
        currency: "BNB",
        amount: nft.bnbPrice,
      };
    }

    return price;
  };

  const tokenId = getPrice().currency === "AFEN" ? 0 : 1;

  const userCheck = () => {
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
  };

  const onBuyNFT = async () => {
    userCheck();
    notify({
      title: `Buy "${nft.title}"`,
      text: "You are about to buy this NFT, click continue to proceed",
      action: {
        text: "Continue",
        onClick: handleBuyNFT,
      },
    });
  };

  const handleBuyNFT = async () => {
    setLoading(true);

    try {
      const nftContract = contractSigned as Nft;
      await nftContract.setApprovalForAll(user.address, true, {
        from: nft.owner.wallet,
      });
      await nftContract.buy(nft.owner.wallet, nft.nftId, 10, tokenId, {
        from: user.address,
      });

      // update nft transaction

      notify({
        status: "success",
        title: `"${nft.title}" It's yours!`,
        text: "Check your wallet, you should find it",
        action: {
          onClick: undefined,
          text: "View",
        },
      });
    } catch (err) {
      setLoading(false);
      // catch error cases
      // - insufficient funds
      if (err.code === 4001) {
        notify({
          ...messages.requestCancelled,
        });
      } else if ((err.code = "NETWORK_ERROR")) {
        notify({
          ...messages.networkError,
        });
      } else if (err?.response?.status === 401) {
        notify(messages.sessionExpired);
        logout();
      } else {
        notify(messages.transactionError);
      }
    }
    setLoading(false);
  };

  const onMintNFT = () => {
    // userCheck();
    notify({
      status: "info",
      title: `Sell "${nft?.title}"`,
      text: "You are about to list this NFT for sale on the Marketplace, click Continue to proceed",
      action: {
        buttonType: ButtonType.PRIMARY,
        text: "Continue",
        onClick: () => handleMintNFT(),
      },
    });
  };

  const handleSuccess = (type: NFTTransactionEnum, status: NFTStatusEnum) => {
    createTransaction(
      {
        userId: user?.user._id,
        type,
        nftId: nft?._id,
        price: getPrice().amount,
      },
      authToken
    )
      .then(() => notify(messages.minted))
      .catch((err) => {
        if (err?.response?.status === 401) {
          logout();
          notify(messages.sessionExpired);
        }
        notify(messages.somethingWentWrong);
      });

    updateNFT(
      {
        _id: nft?._id,
        nftId: nft?.nftId,
        canSell: true,
        status,
      },
      authToken
    ).catch((err) => {
      if (err?.response?.status === 401) {
        logout();
        notify(messages.sessionExpired);
      }
      notify(messages.somethingWentWrong);
    });
  };

  const handleMintNFT = async () => {
    const nftContract = contractSigned as Nft;
    setLoading(true);

    await mintNFT(
      nft.nftId,
      getPrice().amount,
      getPrice().currency === "AFEN" ? 0 : 1,
      nftContract,
      () => handleSuccess(NFTTransactionEnum.MINT, NFTStatusEnum.MINTED),
      () => {
        notify(messages.somethingWentWrong);
      }
    );

    setLoading(false);
  };

  const onCreateNFT = () => {
    userCheck();
    notify({
      status: "info",
      title: `Create "${nft?.title}"`,
      text: "You are about to create this NFT, click Continue to proceed",
      action: {
        buttonType: ButtonType.PRIMARY,
        text: "Continue",
        onClick: () => handleCreateNFT(),
      },
    });
  };

  const handleCreateNFT = async () => {
    const nftContract = contractSigned as Nft;
    setLoading(true);

    await createNFT(
      nft,
      nftContract,
      (response) =>
        handleSuccess(NFTTransactionEnum.CREATE, NFTStatusEnum.CREATED),
      (err) => {
        if ((err.code = "NETWORK_ERROR")) {
          notify(messages.walletNetworkError);
        } else {
          notify(messages.somethingWentWrong);
        }
      }
    );

    setLoading(false);
  };

  const onRemoveFromMarketplace = () => {
    userCheck();
    notify({
      status: "error",
      title: `Remove "${nft?.title}"`,
      text: "You are about to remove this NFT from Marketplace, click Continue to proceed",
      action: {
        buttonType: ButtonType.DELETE,
        text: "Continue",
        onClick: () => handleRemoveFromMarketplace(),
      },
    });
  };

  const handleRemoveFromMarketplace = () => {
    setLoading(true);
    updateNFT(
      {
        _id: nft?._id,
        nftId: nft?.nftId,
        canSell: false,
      },
      authToken
    )
      .then(() => {
        notify(messages.savedChanges);
        reloadPage(nft?._id);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          logout();
          notify(messages.sessionExpired);
        }
        notify(messages.somethingWentWrong);
      });
    setLoading(false);
  };

  const onAddToMarketplace = () => {
    userCheck();
    notify({
      status: "info",
      title: `Add "${nft?.title}"`,
      text: "You are about to add this NFT from Marketplace, click Continue to proceed",
      action: {
        buttonType: ButtonType.PRIMARY,
        text: "Continue",
        onClick: () => handleAddToMarketplace(),
      },
    });
  };

  const handleAddToMarketplace = () => {
    setLoading(true);
    updateNFT(
      {
        _id: nft?._id,
        nftId: nft?.nftId,
        canSell: true,
      },
      authToken
    )
      .then(() => {
        notify(messages.savedChanges);
        reloadPage(nft?._id);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          logout();
          notify(messages.sessionExpired);
        }
        notify(messages.somethingWentWrong);
      });
    setLoading(false);
  };

  return isFallback ? (
    <div></div>
  ) : (
    <div className="w-screen md:h-screen overflow-hidden">
      <div className="flex flex-wrap lg:flex-nowrap justify-between">
        <NFTImage image={nft?.path} />
        <NFTDetails
          nft={nft}
          transactions={transactions}
          price={getPrice()}
          isOwner={isOwner}
          canSell={canSell}
          loading={loading}
          onBuyNFT={onBuyNFT}
          onMintNFT={onMintNFT}
          onCreateNFT={onCreateNFT}
          onAddToMarketplace={onAddToMarketplace}
          onRemoveFromMarketplace={onRemoveFromMarketplace}
          onTweet={() => setShareDialog(true)}
        />
      </div>
    </div>
  );
}
