import React from "react";
import { NFT } from "../../types/NFT";
import ListingGrid from "../Listing/ListingGrid";

export interface UserNFTsProps {
  data: NFT[];
}

export default function UserNFTs({ data }: UserNFTsProps) {
  return (
    <div>
      <ListingGrid data={data} />
    </div>
  );
}
