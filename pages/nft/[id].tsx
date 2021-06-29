import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Title from "../../components/IO/Title";
import Typography from "../../components/IO/Typography";
import Flex from "../../components/Layout/Flex";
import { api } from "../../utils/axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import moment from "moment";
import { BsArrowUpRight } from "react-icons/bs";
import { NFT } from "../../types/NFT";

interface NFTPageProps {
  nft: NFT;
}

// getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await api.post("/nft/list", {
    pageNo: 1,
    numPerPage: 5000,
    filter: {
      isAuction: false,
      price: "",
    },
  });

  const NFTs: NFT[] = response?.data.list || [];

  const paths = NFTs.map(({ _id }) => ({
    params: {
      id: _id,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { id } = params;
  const response = await api.post("nft/list", {
    pageNo: 1,
    numPerPage: 5000,
    filter: {
      isAuction: false,
      price: "",
    },
  });

  const NFTs: NFT[] = response?.data.list || [];

  const nft = NFTs.find((item) => item._id === id);

  if (!nft) {
    return { notFound: true };
  }

  return { props: { nft }, revalidate: 1 };
};

const tabs = ["Description", "Details"];

export default function Token({ nft }: NFTPageProps) {
  const { isFallback, push } = useRouter();
  const [tabIndex, setTabIndex] = React.useState(0);

  const getPrice = () => {
    let price = {
      currency: "AFEN",
      amount: nft.afenPrice,
    };

    if (nft.afenPrice === 0) {
      price = {
        currency: "BNB",
        amount: nft.bnbPrice,
      };
    }

    return price;
  };

  return isFallback ? (
    <div></div>
  ) : (
    <div className="w-screen md:h-screen overflow-hidden">
      <div className="flex flex-wrap lg:flex-nowrap justify-between">
        <div className="mb-5 lg:mb-0 w-full mt-10 py-10 md:mt-0 md:py-0 md:h-screen md:w-3/5 lg:w-4/6 pt-16 flex flex-col items-center justify-between bg-gray-100 dark:bg-gray-500">
          <div className="h-96 px-8 md:px-0 md:h-5/6 w-full md:w-5/6 my-auto">
            <div className="relative h-full w-full">
              <Image
                src={nft.path}
                layout="fill"
                className="overflow-hidden shadow-lg rounded-xl"
                objectFit="contain"
                objectPosition="fill"
              ></Image>
            </div>
          </div>
        </div>
        <div className="relative w-full mb-10 md:w-2/5 lg:w-2/6 sm:mt-16 md:mt-32 flex flex-col px-4 md:px-10 lg:px-16 mx-auto overflow-hidden">
          <Flex spaceBetween wrap style="items-start mb-4 flex-nowrap w-full">
            <div>
              <Title style="text-2xl md:text-3xl font-semibold">
                {nft?.title}
              </Title>
              <Link href={`/user/${nft?.wallet}`}>
                <div className="flex items-end mt-1 cursor-pointer">
                  {/* <div className="w-6 h-6 relative overflow-hidden rounded-full mr-1">
                    <Image
                      src={nft?.userId}
                      layout="fill"
                      objectFit="none"
                    ></Image>
                  </div> */}
                  <Typography sub bold truncate textWidth="w-40">
                    {nft?.wallet}
                  </Typography>
                </div>
              </Link>
            </div>
            <div className="mt-4">
              <Typography sub bold size="small" style="text-right">
                Price
              </Typography>
              <Typography style="text-xl md:text-3xl text-right" bold>
                {getPrice().amount} {getPrice().currency}
              </Typography>
            </div>
          </Flex>
          <div className="mt-3">
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList>
                {tabs.map((tab, tabListIndex) => (
                  <Tab
                    key={tabListIndex}
                    className={`list-none inline-block pr-5 pt-2 mr-2 rounded-t-lg cursor-pointer pb-1 transition-colors duration-75 ease-linear text-sm focus:outline-none font-bold ${
                      tabListIndex === tabIndex
                        ? "bg-afen-yellow"
                        : "text-gray-500"
                    }`}
                  >
                    {tab}
                  </Tab>
                ))}
              </TabList>

              <TabPanel>
                <Typography>{nft.description}</Typography>
                <div className="mt-8">
                  <a
                    href={`https://ipfs.io/ipfs/${nft.fileHash}`}
                    target="_blank"
                    className="underline pb-2"
                  >
                    <Typography bold style="inline-flex">
                      View on IPFS
                      <BsArrowUpRight className="ml-2 text-xl" />
                    </Typography>
                  </a>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="my-5">
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
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
