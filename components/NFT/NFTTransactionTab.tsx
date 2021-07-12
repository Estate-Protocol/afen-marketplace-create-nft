import React from "react";
import { NFTTransaction } from "../../types/NFT";
import Typography from "../IO/Typography";

interface NFTTransactionTabProps {
  transactions: NFTTransaction[];
}

const NFTTransactionTab: React.FC<NFTTransactionTabProps> = ({
  transactions,
}) => {
  return (
    <div className="md:h-64 md:overflow-y-scroll">
      {transactions?.length ? (
        <div></div>
      ) : (
        <Typography sub bold size="small">
          No transactions yet
        </Typography>
      )}
    </div>
  );
};

export default NFTTransactionTab;
