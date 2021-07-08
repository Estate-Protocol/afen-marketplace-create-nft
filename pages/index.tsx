import { useState } from "react";
import HomePage from "../components/Home";
import { fetchNFTs, FetchNFTsFilter } from "../components/Home/apis";
import { NFT } from "../types/NFT";

const NUM_PER_PAGE = 8;

export async function getServerSideProps() {
  return fetchNFTs(1, NUM_PER_PAGE, null, "DESC")
    .then(({ data }) => {
      return {
        props: { nft: data?.list },
      };
    })
    .catch((err) => {
      // handle err
      return {
        props: { nft: [] },
      };
    });
}

export const Home = ({ nft }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NFT[]>(nft);
  const [page, setPage] = useState(1);
  const [totalNFTs, setTotalNFTs] = useState(0);

  const canFetchMore = data.length !== totalNFTs;

  const fetch = (page: number, filter?: FetchNFTsFilter) => {
    setLoading(true);
    fetchNFTs(page, NUM_PER_PAGE, filter, "DESC")
      .then(({ data: fetchedData }) => {
        setData([...data, ...fetchedData.list]);
        setTotalNFTs(fetchedData.total);
      })
      .catch(() => {
        // handle err
      });

    setLoading(false);
  };

  const handleFetchMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetch(nextPage);
  };

  const handleRefresh = () => {
    fetch(page);
  };

  return (
    <>
      <HomePage
        data={data}
        loading={loading}
        hasMore={canFetchMore}
        onRefresh={handleRefresh}
        onFetchMore={handleFetchMore}
      />
    </>
  );
};

export default Home;
