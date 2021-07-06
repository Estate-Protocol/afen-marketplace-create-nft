import { useRouter } from "next/router";
import { NFT } from "../../types/NFT";
import ListingGridItem from "./ListingGridItem";

interface ListingGridProps {
  data: NFT[];
  loading?: boolean;
}

export default function HomeListingGrid({ data, loading }: ListingGridProps) {
  const router = useRouter();

  return (
    <div className="mt-5 mb-20 grid grid-flow-row auto-rows-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-5 sm:gap-x-4 xl:gap-x-5 gap-y-10 md:gap-y-16">
      {data.map(
        (item, index) =>
          item.path && (
            <ListingGridItem
              item={item}
              key={index}
              loading={loading}
              onClick={() => router.push(`/nft/${item._id}`)}
            />
          )
      )}
    </div>
  );
}
