import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../IO/Button";
import { useRouter } from "next/dist/client/router";
import useUser from "../../hooks/useUser";
import Typography from "../IO/Typography";
import { GrClose, GrMenu } from "react-icons/gr";
import Flex from "./Flex";

export default function Header() {
  const node = React.useRef();
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = React.useState(false);

  const { user: userData } = useUser();

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
          <Typography bold style="mr-8">
            <a href="/https://link.medium.com/dJY0veBUlgb">Get Started</a>
          </Typography>

          <Typography bold style="mr-8">
            <Link href={`/user/${userData.address}`}>NFTs</Link>
          </Typography>

          <Button type="primary" onClick={() => router.push("/create")}>
            Create NFT
          </Button>
        </div>

        <div className="ml-auto md:hidden">
          {mobileMenu ? (
            <GrClose
              className="text-2xl fill-current text-dark dark:text-white"
              onClick={() => setMobileMenu(false)}
            />
          ) : (
            <GrMenu
              className="text-2xl fill-current text-dark dark:text-white"
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
                  {userData.address && (
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
                                textWidth="w-4/5"
                                bold
                                truncate
                                style="lowercase"
                              >
                                {userData.address}
                              </Typography>
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
                          <Link href={`/nft/${userData.address}`}>NFTs</Link>
                        </Typography>
                      </div>
                    </>
                  )}
                </div>
                {userData.address && (
                  <Button
                    type="primary"
                    block
                    style="mt-2 w-full"
                    // onClick={handleMobileConnection}
                  >
                    Create
                  </Button>
                )}
              </Flex>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
