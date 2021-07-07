import React, { useEffect, useState } from "react";
import { NFT } from "../../types/NFT";
import Title from "../IO/Title";
import Container from "../Layout/Container";
import ListingGrid from "../Listing/ListingGrid";
import InfiniteScroll from "react-infinite-scroll-component";
import Typography from "../IO/Typography";
import Loader from "react-loader-spinner";

interface HomeProps {
  data: NFT[];
  loading: boolean;
  hasMore: boolean;
  onFetchMore?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  data,
  hasMore,
  loading,
  onFetchMore,
}) => {
  return (
    <div>
      <Container>
        <InfiniteScroll
          dataLength={data.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={<Loader type="Oval" color="#ffffff" height={20} width={20} />}
        >
          <Title>Explore</Title>
          <ListingGrid data={data} loading={loading} />
        </InfiniteScroll>
      </Container>
    </div>
  );
};

Home.displayName = "Home";
export default Home;
