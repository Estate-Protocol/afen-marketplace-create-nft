import { useState } from "react";
import HomePage from "../components/Home";
import { fetchNFTs } from "../components/Home/apis";
import { NFT } from "../types/NFT";
import { getPlaiceholder } from "plaiceholder";
import type { InferGetStaticPropsType } from "next";

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

  const handleFetchMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);

    setLoading(true);
    fetchNFTs(nextPage, NUM_PER_PAGE, null, "DESC")
      .then(({ data: fetchedData }) => {
        setData([...data, ...fetchedData.list]);
        setTotalNFTs(fetchedData.total);
      })
      .catch(() => {
        // handle err
      });

    setLoading(false);
  };

  const getBlurHash = async () => {};

  return (
    <>
      <HomePage
        data={data}
        loading={loading}
        hasMore={canFetchMore}
        onFetchMore={handleFetchMore}
      />
    </>
  );
};

export default Home;
