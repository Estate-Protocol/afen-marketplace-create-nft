import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../IO/Button";
import { useRouter } from "next/dist/client/router";
import useUser from "../../hooks/useUser";
import Typography from "../IO/Typography";
import { GrClose, GrMenu } from "react-icons/gr";
import Flex from "./Flex";
import { FcCheckmark } from "react-icons/fc";
import { copyToClipboard } from "../../utils/misc";
import { HiDuplicate } from "react-icons/hi";

export default function Header() {
  const node = React.useRef();
  const router = useRouter();
  const { user: userData, mobileWalletConnect, disconnectWallet } = useUser();

  const [mobileMenu, setMobileMenu] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleMobileConnection = async () => {
    mobileWalletConnect.walletConnectInit();
  };

  const handleClickOutside = (e) => {
    // @ts-ignore
    if (node.current.contains(e.target)) {
      return;
    }
    // outside click
    setMobileMenu(false);
  };

  React.useEffect(() => {
    if (mobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenu]);

  return (
    <header>
      <div className="flex flex-row px-5 sm:px-20 py-3 md:px-10 lg:px-16 mx-auto overflow-x-hidden border-b-2 bg-white items-center fixed top-0 w-screen z-40">
        <Link href="/">
          <div className="inline-flex items-center cursor-pointer">
            <Image src="/logo.png" width="30" height="30" layout="fixed" />
            <h1 className="font-medium text-lg md:text-xl ml-2 tracking-tight">
              Marketplace
            </h1>
          </div>
        </Link>
        <div className="hidden md:inline-flex items-center ml-auto">
          <Typography style="mr-8">
            <a href="https://link.medium.com/dJY0veBUlgb" target="_blank">
              Get Started
            </a>
          </Typography>

          <Typography style="mr-8">
            <Link href={`/user/` + userData.address}>My Collection</Link>
          </Typography>

          <Button type="primary" onClick={() => router.push("/create")}>
            Create NFT
          </Button>
        </div>

        <div className="ml-auto md:hidden">
          {mobileMenu ? (
            <GrClose
              className="text-xl fill-current text-dark dark:text-white"
              onClick={() => setMobileMenu(false)}
            />
          ) : (
            <GrMenu
              className="text-xl fill-current text-dark dark:text-white"
              onClick={() => setMobileMenu(true)}
            />
          )}
        </div>

        {mobileMenu && (
          <div className="md:hidden fixed top-14 right-0 w-screen h-screen bg-black dark:bg-afen-blue bg-opacity-40 dark:bg-opacity-60">
            <div ref={node}>
              <Flex
                col
                style="w-full bg-white dark:bg-rich-black rounded-b-3xl shadow-2xl px-4 z-40 md:px-10 lg:px-16 pt-4 pb-6"
              >
                <div className="w-full">
                  <>
                    {userData.address && (
                      <Flex center style="mb-3 overflow-hidden w-full">
                        <div className="mr-3">
                          <div className="relative h-12 w-12 rounded-full bg-gray-300">
                            {userData.user?.avatar && (
                              <Image
                                src={userData.user?.avatar}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <Typography size="x-small" sub style="-mb-1">
                            Wallet
                          </Typography>
                          <div className="inline-flex">
                            <Typography
                              textWidth="w-60"
                              bold
                              truncate
                              style="lowercase"
                              onClick={() =>
                                router.push(`/user/${userData.address}`)
                              }
                            >
                              {userData.address}
                            </Typography>
                            {copied ? (
                              <FcCheckmark className="ml-2 h-5 w-5" />
                            ) : (
                              <HiDuplicate
                                onClick={() =>
                                  copyToClipboard(userData.address, setCopied)
                                }
                                className={`${
                                  open ? "" : "text-opacity-70"
                                } ml-2 h-5 w-5 group-hover:text-opacity-80 transition ease-in-out duration-150 cursor-pointer`}
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          {/* <div className="">
                            <Typography size="x-small" sub style="mt-1 -mb-1">
                              Balance
                            </Typography>
                            <Typography bold sub>
                              {userData?.balance?.toFixed(3) || 0}{" "}
                              <span className="text-sm font-normal text-gray-600">
                                BNB
                              </span>
                            </Typography>
                          </div> */}
                        </div>
                      </Flex>
                    )}
                    <div className="w-full border-b dark:border-gray-800 pb-3 mb-3 mt-3">
                      <Typography>
                        <a href="/https://link.medium.com/dJY0veBUlgb">
                          Get Started
                        </a>
                      </Typography>
                      <Typography style="mt-3">
                        <Link href={`/user/` + userData.address}>
                          My Collection
                        </Link>
                      </Typography>
                      {userData.address && (
                        <Typography
                          style="mt-3"
                          onClick={() => disconnectWallet()}
                        >
                          Disconnect Wallet
                        </Typography>
                      )}
                    </div>
                  </>
                </div>

                <Button
                  type="primary"
                  block
                  icon
                  style="mt-2 w-full"
                  onClick={() =>
                    userData.address
                      ? router.push("/create")
                      : handleMobileConnection()
                  }
                >
                  {userData.address ? (
                    "Create"
                  ) : (
                    <>
                      <Image
                        src="/metamask.svg"
                        height="20"
                        width="20"
                        layout="fixed"
                      />
                      <span className="ml-2">Connect Wallet</span>
                    </>
                  )}
                </Button>
              </Flex>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
