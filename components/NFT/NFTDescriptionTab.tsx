import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { NFT } from "../../types/NFT";
import Typography from "../IO/Typography";

interface NFTDescriptionTabProps {
  nft: NFT;
}

export const NFTDescriptionTab: React.FC<NFTDescriptionTabProps> = ({
  nft,
}) => {
  return (
    <div className="md:h-64 md:overflow-y-scroll">
      <Typography readMore>{nft.description}</Typography>
      <div className="mt-8">
        <a
          href={`https://ipfs.io/ipfs/${nft.fileHash}`}
          target="_blank"
          className="underline pb-2"
        >
          <Typography bold style="inline-flex mb-2">
            View on IPFS
            <BsArrowUpRight className="ml-2 text-xl" />
          </Typography>
        </a>
        <br />
        <a
          href="https://opensea.io/"
          target="_blank"
          className="underline pb-2"
        >
          <Typography bold style="inline-flex">
            View on Opensea
            <BsArrowUpRight className="ml-2 text-xl" />
          </Typography>
        </a>
      </div>
    </div>
  );
};

export default NFTDescriptionTab;
