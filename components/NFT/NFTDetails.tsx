import React from "react";
import { NFT, NFTTransaction } from "../../types/NFT";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";
import Tabs from "../Tabs/Tabs";
import UserAvatar from "../User/UserAvatar";
import NFTActions from "./NFTActions";
import { NFTDescriptionTab } from "./NFTDescriptionTab";
import NFTDetailsTab from "./NFTDetailsTab";
import NFTShareDialog from "./NFTShareDialog";
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
  onTweet: () => void;
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
  onTweet,
}) => {
  return (
    <div className="relative w-full mb-10 md:w-2/5 lg:w-2/6 sm:mt-16 md:mt-32 flex flex-col mx-auto overflow-hidden">
      <div className="px-4 md:px-10 lg:px-16">
        <div className="mb-4">
          <Flex spaceBetween wrap center style="w-full">
            <div className="mb-2 w-4/5">
              <Title style="text-2xl md:text-3xl font-semibold">
                {nft?.title}
              </Title>
            </div>
            <NFTShareDialog nft={nft} />
          </Flex>

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
                title: "Transactions",
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
      <NFTActions
        nft={nft}
        status={nft?.status}
        loading={loading}
        isOwner={isOwner}
        canSell={canSell}
        onBuyNFT={onBuyNFT}
        onMintNFT={onMintNFT}
        onCreateNFT={onCreateNFT}
        onRemoveFromMarketplace={onRemoveFromMarketplace}
        onAddToMarketplace={onAddToMarketplace}
      />
    </div>
  );
};

export default NfTDetails;
