import { Popover, Transition } from "@headlessui/react";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { FcCheckmark } from "react-icons/fc";
import Image from "next/image";
import { useRouter } from "next/router";
import Typography from "../IO/Typography";
import Button from "../IO/Button";
import { userLinks } from "../../constants/links";
import { UserDetails } from "./UserProvider";
import { copyToClipboard, getInitials } from "../../utils/misc";
import { HiDuplicate } from "react-icons/hi";

interface UserDropdownMenuProps {
  data: UserDetails;
  walletAddressIsCopied?: boolean;
  onCopyWalletAddress: Dispatch<SetStateAction<boolean>>;
  onDisconnectWallet: Dispatch<SetStateAction<void>>;
}

export default function UserDropdownMenu({
  data,
  walletAddressIsCopied,
  onCopyWalletAddress,
  onDisconnectWallet,
}: UserDropdownMenuProps) {
  const router = useRouter();

  return (
    <div className="inline-block">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="focus:outline-none">
              {
                <div className="relative h-10 w-10 mt-1 bg-gray-100 overflow-hidden flex justify-center items-center rounded-full">
                  {data.user?.avatar ? (
                    <Image src={data.user.avatar} layout="fill" />
                  ) : (
                    <Typography bold>{getInitials(data.user?.name)}</Typography>
                  )}
                </div>
              }
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-82 max-w-sm px-4 mt-2 transform right-0 sm:px-0 lg:max-w-3x">
                <div className="overflow-hidden rounded-b-xl py-2 bg-white dark:bg-afen-blue shadow-xl ring-1 ring-black ring-opacity-5 overflow-ellipsis">
                  <div className="px-5 py-4 border-b dark:border-gray-700">
                    <Typography sub size="x-small">
                      Wallet
                    </Typography>
                    <div className="flex mb-1.5">
                      <Typography bold truncate textWidth="w-24 lg:w-48">
                        {data.address}
                      </Typography>
                      {walletAddressIsCopied ? (
                        <FcCheckmark className="ml-2 h-5 w-5" />
                      ) : (
                        <HiDuplicate
                          onClick={() =>
                            copyToClipboard(data.address, onCopyWalletAddress)
                          }
                          className={`${
                            open ? "" : "text-opacity-70"
                          } ml-2 h-5 w-5 group-hover:text-opacity-80 transition ease-in-out duration-150 cursor-pointer`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="mt-3">
                      <Typography sub size="x-small">
                        Balance
                      </Typography>
                      <Typography bold>
                        {data.balance?.toFixed(3) || 0}{" "}
                        <span className="text-sm text-gray-600">BNB</span>
                      </Typography>
                    </div>
                  </div>

                  <div className="relative px-5 py-3">
                    {userLinks.map((item, index) => (
                      <div key={index}>
                        <Button
                          type="plain"
                          style="py-0"
                          onClick={() => router.push(item.href)}
                        >
                          <Typography style="mb-3 font-normal">
                            {item.label}
                          </Typography>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="plain"
                      style="py-0"
                      onClick={onDisconnectWallet}
                    >
                      <Typography style="font-normal">Disconnect</Typography>
                    </Button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
