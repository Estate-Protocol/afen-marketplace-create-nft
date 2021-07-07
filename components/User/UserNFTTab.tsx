import { useRouter } from "next/router";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";
import { messages } from "../../constants/messages";
import useNotifier from "../../hooks/useNotifier";
import { NFT } from "../../types/NFT";
import { fetchNFTs } from "../Home/apis";
import Button from "../IO/Button";
import Typography from "../IO/Typography";
import ListingGrid from "../Listing/ListingGrid";
import { GiEmptyMetalBucketHandle } from "react-icons/gi";

const NUM_PER_PAGE = 10;

export interface UserNFTabProps {
  wallet: string;
}

export const UserNFTTab: React.FC<UserNFTabProps> = ({ wallet }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NFT[]>([]);
  const [page, setPage] = useState(1);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const { notify } = useNotifier();
  const router = useRouter();

  const canFetchMore = data.length !== totalNFTs;
  React.useEffect(() => {
    fetchNFTs(1, NUM_PER_PAGE, { wallet }, "DESC")
      .then(({ data }) => {
        setData(data.list);
      })
      .catch(() => {
        notify(messages.somethingWentWrong);
      });
  }, []);

  const handleFetchMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);

    setLoading(true);
    fetchNFTs(nextPage, NUM_PER_PAGE, { wallet }, "DESC")
      .then(({ data: fetchedData }) => {
        setData([...data, ...fetchedData.list]);
        setTotalNFTs(fetchedData.total);
      })
      .catch(() => {
        notify(messages.somethingWentWrong);
      });

    setLoading(false);
  };

  return (
    <div>
      {!!data.length ? (
        <InfiniteScroll
          dataLength={data.length}
          next={handleFetchMore}
          hasMore={canFetchMore}
          loader={<Loader type="Oval" color="#000000" height={20} width={20} />}
        >
          <ListingGrid data={data} loading={loading} />
        </InfiniteScroll>
      ) : (
        <div className="mt-5 mx-auto flex justify-center text-center">
          <div className="py-40">
            <GiEmptyMetalBucketHandle className="text-9xl mx-auto" />
            <Typography sub style="md:w-96 mb-4">
              All your NFTs would appear here.
            </Typography>
            <Button size="large" onClick={() => router.push("/create")}>
              Create NFT
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNFTTab;
