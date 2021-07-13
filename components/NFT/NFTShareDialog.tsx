import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { BiLink } from "react-icons/bi";
import { GrTwitter } from "react-icons/gr";
import { IoShareOutline } from "react-icons/io5";
import { NFT } from "../../types/NFT";
import { copyToClipboard } from "../../utils/misc";
import Button from "../IO/Button";
import Typography from "../IO/Typography";
import Flex from "../Layout/Flex";
import { FcCheckmark } from "react-icons/fc";

interface NFTShareDialogProps {
  nft: NFT;
}

const NFTShareDialog: React.FC<NFTShareDialogProps> = ({ nft }) => {
  const tweet = `Check out this artwork "${nft?.title}" on AFEN NFT Marketplace ${process.env.NEXT_PUBLIC_HOST_URL}/nft/${nft?._id}`;

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="w-full text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <Button size="small" type="plain">
              <IoShareOutline className="text-3xl" />
            </Button>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-white rounded-md shadow-lg focus:outline-none">
            <div className="px-5 py-4">
              <div className="mb-4 w-full">
                <Menu.Item>
                  {() => (
                    <>
                      <a
                        href={`https://twitter.com/intent/tweet/?text=${tweet}`}
                        target="_blank"
                        data-show-count="false"
                      >
                        <Flex>
                          <GrTwitter className="text-2xl text-blue-500 mr-2" />
                          <Typography bold>Tweet</Typography>
                        </Flex>
                      </a>
                    </>
                  )}
                </Menu.Item>
              </div>
              <div className="w-full">
                <Menu.Item
                  onClick={() =>
                    copyToClipboard(
                      `${process.env.NEXT_PUBLIC_HOST_URL}/nft/${nft?._id}`
                    )
                  }
                >
                  {() => (
                    <Flex>
                      <BiLink className="text-2xl text-gray-400 mr-2" />
                      <Typography bold>Copy Link</Typography>
                    </Flex>
                  )}
                </Menu.Item>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default NFTShareDialog;
