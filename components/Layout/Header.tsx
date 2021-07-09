import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../IO/Button";
import { useRouter } from "next/dist/client/router";
import useUser from "../../hooks/useUser";
import Typography from "../IO/Typography";
import { GrClose, GrMenu } from "react-icons/gr";
import Flex from "./Flex";
import { getInitials } from "../../utils/misc";
import useAuth from "../../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
  const node = React.useRef();
  const router = useRouter();
  const { user: userData, mobileWalletConnect, disconnectWallet } = useUser();
  const { isAuthenticated } = useAuth();

  const { toggleLoginDialog, logout } = useAuth();

  const [mobileMenu, setMobileMenu] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleMobileConnection = async () => {
    mobileWalletConnect.walletConnectInit();
  };

  const handleClickOutside = (e: { target: any }) => {
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

  // hanle route change
  React.useEffect(() => {
    setMobileMenu(false);
  }, [router.pathname]);

  return (
    <header>
      <div className="flex flex-row px-5 md:px-10 lg:px-16 py-3 mx-auto overflow-x-hidden border-b-2 bg-white items-center fixed top-0 w-screen z-40">
        <Link href="/">
          <div className="inline-flex items-center cursor-pointer">
            <Image src="/logo.png" width="30" height="30" layout="fixed" />
            <h1 className="font-medium text-lg md:text-xl ml-2 tracking-tight">
              Marketplace
            </h1>
          </div>
        </Link>

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

        <div className="md:inline-flex items-center md:ml-auto">
          <Typography style="hidden md:block mr-8" sub bold>
            <a href="https://link.medium.com/dJY0veBUlgb" target="_blank">
              Get Started
            </a>
          </Typography>
          <Button
            style="mr-8 hidden md:block"
            type="primary"
            onClick={() => router.push("/create")}
          >
            Create NFT
          </Button>

          {isAuthenticated ? (
            <div className="inline-flex items-center">
              <div
                className="relative h-8 w-8 bg-gray-100 ring-2 ring-afen-yellow overflow-hidden flex justify-center items-center rounded-full cursor-pointer ml-4 md:ml-0"
                onClick={() => router.push(`/user/${userData.user?._id}`)}
              >
                {userData.user?.avatar ? (
                  <Image src={userData.user.avatar} layout="fill" />
                ) : (
                  <Typography bold>
                    {getInitials(userData.user?.name)}
                  </Typography>
                )}
              </div>
              <Button type="plain" style="ml-4" onClick={() => logout()}>
                <FiLogOut className="text-2xl" />
              </Button>
            </div>
          ) : (
            <Button
              style="hidden md:block"
              type="outlined"
              onClick={() => toggleLoginDialog(true)}
            >
              Login
            </Button>
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
                  <Button
                    style="mb-5"
                    type="plain"
                    onClick={() =>
                      isAuthenticated ? logout() : toggleLoginDialog(true)
                    }
                  >
                    <Typography sub bold size="medium">
                      {isAuthenticated ? "Logout" : "Login"}
                    </Typography>
                  </Button>
                  <Typography style="mb-5" sub bold size="medium">
                    <a
                      href="https://link.medium.com/dJY0veBUlgb"
                      target="_blank"
                    >
                      Get Started
                    </a>
                  </Typography>
                </div>

                <Button
                  block
                  size="large"
                  style="ml-8"
                  type="primary"
                  onClick={() => router.push("/create")}
                >
                  Create NFT
                </Button>
              </Flex>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
