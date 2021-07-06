import React, { useState } from "react";
import Image from "next/image";
import { FcCheckmark } from "react-icons/fc";
import { copyToClipboard, parseUrl } from "../../utils/misc";
import { GrInstagram, GrTwitter } from "react-icons/gr";
import Title from "../../components/IO/Title";
import Container from "../../components/Layout/Container";
import Tabs from "../../components/Tabs/Tabs";
import Typography from "../../components/IO/Typography";
import { HiDuplicate } from "react-icons/hi";
import { User } from "../../types/User";
import useUser from "../../hooks/useUser";
import ConnectWalletPage from "../../components/User/ConnectWalletPage";
import { useRouter } from "next/router";
import { api } from "../../utils/axios";
import { GetStaticPaths, GetStaticProps } from "next";
import UserNFTs from "../../components/User/UserNFTs";
import { NFT } from "../../types/NFT";
import Button from "../../components/IO/Button";
import withAuth from "../../components/HOC/withAuth";

interface UserProfilePageProps {
  data: User;
  nfts: NFT[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await api.post("/nft/list", {
    pageNo: 1,
    numPerPage: 50,
    filter: {
      isAuction: false,
      price: "",
    },
  });

  const NFTs: NFT[] = response?.data.list || [];

  const paths = NFTs.flatMap(({ wallet, path }) =>
    wallet && path
      ? {
          params: {
            id: wallet,
          },
        }
      : []
  );

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { id } = params;
  const response = await api.post("nft/list", {
    pageNo: 1,
    numPerPage: 50,
    filter: {
      isAuction: false,
      price: "",
      wallet: id,
    },
  });

  const nfts: NFT[] = response?.data.list || [];

  // if (!nfts) {
  //   return { notFound: true };
  // }

  return { props: { nfts }, revalidate: 1 };
};

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ nfts }) => {
  const [copied, setCopied] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const { address: walletAddress } = user;
  const { id } = router.query;

  return id && walletAddress ? (
    <div>
      <div
        className="w-screen h-80 relative bg-gray-100 dark:bg-gray-900"
        style={{ minHeight: "280px", height: "280px" }}
      ></div>
      <div
        className="rounded-full h-40 w-40 shadow-md p-2 ring-4 ring-afen-yellow  flex items-center justify-center relative overflow-hidden -mt-20 mb-8 mx-auto bg-gray-100"
        style={{ width: "160px", height: "160px", marginTop: "-80px" }}
      ></div>
      <div className="flex justify-center mx-auto">
        <Typography size="large" truncate textWidth="w-60" bold>
          {walletAddress}
        </Typography>
        {copied ? (
          <FcCheckmark className="ml-2 h-5 w-5" />
        ) : (
          <HiDuplicate
            onClick={() => copyToClipboard(walletAddress, setCopied)}
            className={`ml-2 h-5 w-5 text-orange-300 group-hover:text-opacity-80 transition ease-in-out duration-150 cursor-pointer`}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="w-screen px-5 md:px-10 lg:px-16 mx-auto overflow-x-hidden mt-0 mb-10">
        <div className="mt-16 mx-auto">
          <Tabs
            tabs={[
              {
                title: "NFTs",
                body: <UserNFTs data={nfts} />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  ) : (
    <ConnectWalletPage />
  );
};

UserProfilePage.displayName = "UserProfilePage";
export default withAuth(UserProfilePage);
