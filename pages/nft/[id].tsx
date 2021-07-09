import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Title from "../../components/IO/Title";
import Typography from "../../components/IO/Typography";
import Flex from "../../components/Layout/Flex";
import { api } from "../../utils/axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import moment from "moment";
import { BsArrowUpRight } from "react-icons/bs";
import {
  NFT,
  NFTStatusEnum,
  NFTTransaction,
  NFTTransactionEnum,
} from "../../types/NFT";
import Button, { ButtonType } from "../../components/IO/Button";
import useUser from "../../hooks/useUser";
import useContract from "../../hooks/useContract";
import useAuth from "../../hooks/useAuth";
import useNotifier from "../../hooks/useNotifier";
import { messages } from "../../constants/messages";
import { createNFT, mintNFT } from "../../components/NFT/utils";
import { Nft } from "../../contracts/types";
import { NFT_ABI } from "../../contracts/abis/Nft";
import UserAvatar from "../../components/User/UserAvatar";
import { ContractTransaction } from "ethers";
import { createTransaction, updateNFT } from "../../components/NFT/apis";
import { logout } from "../../components/Auth/apis/auth";
import { reloadPage } from "../../utils";

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
  const [tabIndex, setTabIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [minting, setMinting] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  const { user, connectWallet } = useUser();
  const { authToken, isAuthenticated, toggleLoginDialog } = useAuth();
  const { setAbi, contractSigned } = useContract();
  const { notify } = useNotifier();

  const tabs = ["Description", "Transactions", "Details"];
  const isOwner = isAuthenticated && user?.user?._id === nft?.owner?._id;
  const canSell = nft?.status === NFTStatusEnum.MINTED && nft?.canSell;

  console.log(user?.user?._id, nft?.owner?._id);

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
      // - wrong network
      // - request cancelled
      return notify({
        ...messages.transactionError,
        action: {
          text: "Retry",
          onClick: onBuyNFT,
        },
      });
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
    setMinting(true);

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

    setMinting(false);
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
    setCreating(true);

    await createNFT(
      nft,
      nftContract,
      (response) =>
        handleSuccess(NFTTransactionEnum.CREATE, NFTStatusEnum.CREATED),
      () => {
        notify(messages.somethingWentWrong);
      }
    );

    setCreating(false);
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
        // reloadPage(nft?._id);
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
        // reloadPage(nft?._id);
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
        <div className="mb-5 lg:mb-0 w-full mt-10 py-10 md:mt-0 md:py-0 md:h-screen md:w-3/5 lg:w-4/6 pt-16 flex flex-col items-center justify-between bg-gray-100 dark:bg-gray-500">
          <div className="h-96 px-8 md:px-0 md:h-5/6 md:pt-10 w-full md:w-5/6 my-auto">
            <div className="relative h-full w-full">
              <Image
                loading="eager"
                priority={true}
                src={nft.path}
                layout="fill"
                className="overflow-hidden shadow-lg"
                objectFit="contain"
                objectPosition="fill"
              ></Image>
            </div>
          </div>
        </div>
        <div className="relative w-full mb-10 md:w-2/5 lg:w-2/6 sm:mt-16 md:mt-32 flex flex-col mx-auto overflow-hidden">
          <div className="px-4 md:px-10 lg:px-16">
            <Flex spaceBetween wrap start style="mb-4 w-full">
              <div className="mb-2">
                <Title style="text-2xl md:text-3xl font-semibold mb-1">
                  {nft?.title}
                </Title>

                <div className="flex items-end mt-1">
                  <UserAvatar
                    image={nft?.creator?.avatar}
                    name={nft?.creator?.name}
                  />
                  <Typography sub bold truncate textWidth="w-40">
                    {nft?.creator.name}
                  </Typography>
                </div>
              </div>
            </Flex>
            <div>
              <Typography sub bold size="small">
                Price
              </Typography>
              <Typography style="text-xl md:text-3xl" bold>
                {getPrice().amount || 0} {getPrice().currency}
              </Typography>
            </div>
            <div className="mt-3">
              <Tabs
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
              >
                <TabList>
                  {tabs.map((tab, tabListIndex) => (
                    <Tab
                      key={tabListIndex}
                      className={`list-none inline-block pr-5 pt-2 mr-2 rounded-t-lg cursor-pointer pb-1 transition-colors duration-75 ease-linear text-sm focus:outline-none font-bold ${
                        tabListIndex === tabIndex
                          ? "bg-afen-yellow"
                          : "text-gray-500"
                      }`}
                    >
                      {tab}
                    </Tab>
                  ))}
                </TabList>

                <TabPanel>
                  <div className="md:h-64 md:overflow-y-scroll">
                    <Typography readMore>{nft.description}</Typography>
                    <div className="mt-8">
                      <a
                        href={`https://ipfs.io/ipfs/${nft.fileHash}`}
                        target="_blank"
                        className="underline pb-2"
                      >
                        <Typography bold style="inline-flex">
                          View on IPFS
                          <BsArrowUpRight className="ml-2 text-xl" />
                        </Typography>
                      </a>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="md:h-64 md:overflow-y-scroll">
                    {transactions?.length ? (
                      <div></div>
                    ) : (
                      <Typography sub bold size="small">
                        No transactions yet
                      </Typography>
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="my-5 md:overflow-y-scroll">
                    <div className="mb-4">
                      <Typography size="x-small" style="mb-1" sub bold>
                        Owner
                      </Typography>
                      <Flex>
                        <UserAvatar
                          image={nft?.owner.avatar}
                          name={nft?.owner.name}
                        />
                        <Typography>{nft?.owner.name}</Typography>
                      </Flex>
                    </div>
                    <div className="mb-4">
                      <Typography size="x-small" style="mb-1" sub bold>
                        Creator
                      </Typography>
                      <Flex>
                        <UserAvatar
                          image={nft?.creator.avatar}
                          name={nft?.creator.name}
                        />
                        <Typography>{nft?.creator.name}</Typography>
                      </Flex>
                    </div>
                    <div className="mb-4">
                      <Typography size="x-small" sub bold>
                        Last update
                      </Typography>
                      <Typography>
                        {moment(nft.updatedAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </Typography>
                    </div>
                    <div>
                      <Typography size="x-small" sub bold>
                        Created
                      </Typography>
                      <Typography>
                        {moment(nft.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </Typography>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>

          <div className="pt-10 md:pt-4 md:absolute md:bottom-0 bg-white w-full md:border-t-2 px-4 md:px-10 lg:px-16 mt-10 md:mt-auto">
            {isOwner ? (
              <>
                {nft?.status === NFTStatusEnum.UPLOADED && (
                  <>
                    <Button
                      block
                      type="outlined"
                      size="large"
                      style="mb-4"
                      onClick={onCreateNFT}
                      loading={creating}
                    >
                      Create NFT
                    </Button>
                    <Typography sub size="x-small" style="text-center">
                      You are seeing this because creating NFT for this was not
                      successful, try again
                    </Typography>
                  </>
                )}
                {nft?.status === NFTStatusEnum.CREATED && (
                  <>
                    <Button
                      block
                      type="outlined"
                      size="large"
                      style="mb-4"
                      onClick={onMintNFT}
                      loading={minting}
                    >
                      Sell
                    </Button>
                    {/* <Typography sub size="x-small" style="text-center">
                      This would make your NFT available on the Marketplace
                    </Typography> */}
                  </>
                )}
                {nft?.status === NFTStatusEnum.MINTED && nft?.canSell ? (
                  <>
                    <Button
                      block
                      type="delete"
                      size="large"
                      style="mb-4"
                      onClick={onRemoveFromMarketplace}
                      loading={loading}
                      disabled={!canSell}
                    >
                      Remove from Marketplace
                    </Button>
                    <Typography sub size="x-small" style="text-center">
                      This would take your NFT off the Marketplace
                    </Typography>
                  </>
                ) : (
                  <>
                    <Button
                      block
                      size="large"
                      style="mb-4"
                      onClick={onAddToMarketplace}
                      loading={loading}
                    >
                      Add to Marketplace
                    </Button>
                    <Typography sub size="x-small" style="text-center">
                      This would list your NFT on the Marketplace
                    </Typography>
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  block
                  size="large"
                  onClick={onBuyNFT}
                  loading={loading}
                  style="mb-4"
                  disabled={!canSell}
                >
                  Buy
                </Button>
                {!canSell && (
                  <Typography sub size="x-small" style="text-center">
                    This NFT is not available for sale
                  </Typography>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
