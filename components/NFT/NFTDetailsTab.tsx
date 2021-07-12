import moment from "moment";
import React from "react";
import { NFT } from "../../types/NFT";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";
import UserAvatar from "../User/UserAvatar";

interface NFTDetailsTabProps {
  nft: NFT;
}

const NFTDetailsTab: React.FC<NFTDetailsTabProps> = ({ nft }) => {
  return (
    <div className="my-5 md:overflow-y-scroll">
      <div className="mb-4">
        <Typography size="x-small" style="mb-1" sub bold>
          Owner
        </Typography>
        <Flex>
          <UserAvatar image={nft?.owner.avatar} name={nft?.owner.name} />
          <Typography sub bold>
            {nft?.owner.name}
          </Typography>
        </Flex>
      </div>
      <div className="mb-4">
        <Typography size="x-small" style="mb-1" sub bold>
          Creator
        </Typography>
        <Flex>
          <UserAvatar image={nft?.creator.avatar} name={nft?.creator.name} />
          <Typography sub bold>
            {nft?.creator.name}
          </Typography>
        </Flex>
      </div>
      <div className="mb-4">
        <Typography size="x-small" sub bold>
          Last update
        </Typography>
        <Typography>
          {moment(nft.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
        </Typography>
      </div>
      <div>
        <Typography size="x-small" sub bold>
          Created
        </Typography>
        <Typography>
          {moment(nft.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
        </Typography>
      </div>
    </div>
  );
};

export default NFTDetailsTab;
