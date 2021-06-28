import React from "react";
import { NFT } from "../../types/NFT";
import { CardMedia, CardText, CardAvatar } from "../Card";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";

interface ListingGridItemProps {
  item: NFT;
  width?: string;
  onClick: () => void;
}

export default function HomeListingGridItem({
  item,
  width,
  onClick,
}: ListingGridItemProps) {
  return (
    <div
      className={`cursor-pointer bg-gray-500 border dark:border-gray-700 overflow-hidden rounded-xl ${
        width ? width : "w-auto"
      }`}
      onClick={onClick}
    >
      <CardMedia src={item.path} />
      <CardText>
        <Typography
          textWidth="w-full"
          truncate
          style="text-xl font-medium dark:text-gray-400"
        >
          {item.title}
        </Typography>
        <Flex style="mb-3 mt-1">
          {/* <CardAvatar image={item.} /> */}
          <Typography size="x-small" style="text-gray-500">
            {item.wallet}
          </Typography>
        </Flex>

        <Typography style="font-semibold">{item.price} BNB</Typography>
        {/* <Typography textWidth="w-full" truncate sub size="x-small">
          {item.description}
        </Typography> */}
      </CardText>
    </div>
  );
}
