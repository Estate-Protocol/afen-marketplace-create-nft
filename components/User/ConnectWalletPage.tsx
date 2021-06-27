import React from "react";
import Image from "next/image";
import Button from "../IO/Button";
import Flex from "../Layout/Flex";
import Container from "../Layout/Container";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import { getUser } from "./api";
import useUser from "../../hooks/useUser";
import { isMobile } from "../../utils/misc";
import { BsArrowRight } from "react-icons/bs";

export default function ConnectWalletPage() {
  const { user, connectWallet, mobileWalletConnect } = useUser();

  const handleMobileConnection = async () => {
    mobileWalletConnect.walletConnectInit().then(async () => {
      await getUser(user.address);
    });
  };

  return (
    <Container style="md:w-2/3 lg:w-2/5 mx-auto">
      <div className="my-24">
        <Title>Connect Your Wallet</Title>
        <Image
          src="/metamask.svg"
          width="100"
          height="100"
          layout="fixed"
        ></Image>
        <Typography sub style="mt-2">
          Think of wallets as your physical wallet or purse but in this case it
          keeps digital currencies (cryptocurrencies). Connecting your wallets
          will help you buy, bid or create NFTs. We use MetaMask to connect your
          wallet,{" "}
          <a
            href="https://afenblockchain.medium.com/afen-art-marketplace-getting-started-on-nfts-f34575cb659b"
            className="text-black dark:text-afen-yellow underline"
          >
            get started.
          </a>
        </Typography>
        <div className="mt-8">
          <Button
            size="large"
            onClick={() =>
              isMobile() ? handleMobileConnection() : connectWallet()
            }
          >
            <Flex>
              <Typography>Connect Wallet</Typography>
              <BsArrowRight className="ml-2 text-xl md:text-2xl" />
            </Flex>
          </Button>
        </div>
      </div>
    </Container>
  );
}
