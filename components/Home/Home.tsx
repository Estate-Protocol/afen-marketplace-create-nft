import React from "react";
import { NFT } from "../../types/NFT";
import Title from "../IO/Title";
import Container from "../Layout/Container";
import ListingGrid from "../Listing/ListingGrid";
import InfiniteScroll from "react-infinite-scroll-component";

interface HomeProps {
  data: NFT[];
  loading: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onFetchMore?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  data,
  hasMore,
  loading,
  onRefresh,
  onFetchMore,
}) => {
  return (
    <div>
      <Container>
        <InfiniteScroll
          // pullDownToRefresh={false}
          // pullDownToRefreshContent={"Pull Down to Refresh"}
          refreshFunction={onRefresh}
          dataLength={data.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={""}
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
