import React from "react";
import { NFT, NFTStatusEnum } from "../../types/NFT";
import Button from "../IO/Button";
import Typography from "../IO/Typography";

interface NFTActions {
  nft: Pick<NFT, "canSell">;
  status: NFTStatusEnum;
  isOwner: boolean;
  canSell: boolean;
  loading: boolean;
  onBuyNFT: () => void;
  onMintNFT: () => void;
  onCreateNFT: () => void;
  onRemoveFromMarketplace: () => void;
  onAddToMarketplace: () => void;
}

const NFTActions: React.FC<NFTActions> = ({
  nft,
  status,
  isOwner,
  canSell,
  loading,
  onBuyNFT,
  onMintNFT,
  onCreateNFT,
  onRemoveFromMarketplace,
  onAddToMarketplace,
}) => {
  return (
    <div className="pt-10 md:pt-4 md:absolute md:bottom-0 bg-white w-full md:border-t-2 px-4 md:px-10 lg:px-16 mt-10 md:mt-auto">
      {isOwner ? (
        <>
          {status === NFTStatusEnum.UPLOADED && (
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
          {status === NFTStatusEnum.CREATED && (
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
          {status === NFTStatusEnum.MINTED && nft?.canSell && (
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
          {status === NFTStatusEnum.MINTED && !nft?.canSell && (
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
  );
};

export default NFTActions;
