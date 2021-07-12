import React from "react";
import { NFT, NFTStatusEnum, NFTTransaction } from "../../types/NFT";
import Button from "../IO/Button";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";
import Tabs from "../Tabs/Tabs";
import UserAvatar from "../User/UserAvatar";
import { NFTDescriptionTab } from "./NFTDescriptionTab";
import NFTDetailsTab from "./NFTDetailsTab";
import NFTTransactionTab from "./NFTTransactionTab";

interface NFTDetails {
  nft: NFT;
  transactions: NFTTransaction[];
  price: {
    currency: string;
    amount: number;
  };
  isOwner: boolean;
  canSell: boolean;
  loading: boolean;
  onBuyNFT: () => void;
  onMintNFT: () => void;
  onCreateNFT: () => void;
  onRemoveFromMarketplace: () => void;
  onAddToMarketplace: () => void;
}

const NfTDetails: React.FC<NFTDetails> = ({
  nft,
  price,
  isOwner,
  canSell,
  loading,
  transactions,
  onBuyNFT,
  onMintNFT,
  onCreateNFT,
  onRemoveFromMarketplace,
  onAddToMarketplace,
}) => {
  const tabs = ["Description", "Transactions", "Details"];

  return (
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
            {price.amount || 0} {price.currency}
          </Typography>
        </div>
        <div className="mt-3">
          <Tabs
            tabs={[
              {
                title: "Description",
                body: <NFTDescriptionTab nft={nft} />,
              },
              {
                title: "Transacions",
                body: <NFTTransactionTab transactions={transactions} />,
              },
              {
                title: "Details",
                body: <NFTDetailsTab nft={nft} />,
              },
            ]}
          ></Tabs>
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
                  loading={loading}
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
                  loading={loading}
                >
                  Sell
                </Button>
                <Typography sub size="x-small" style="text-center">
                  This would make your NFT available on the Marketplace
                </Typography>
              </>
            )}
            {nft?.status === NFTStatusEnum.MINTED && nft?.canSell && (
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
            )}
            {nft?.status === NFTStatusEnum.MINTED && !nft?.canSell && (
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
  );
};

export default NfTDetails;
