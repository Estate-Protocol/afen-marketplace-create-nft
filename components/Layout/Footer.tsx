import React from "react";
import Image from "next/image";

import { GrInstagram, GrTwitter, GrMedium } from "react-icons/gr";
import { HiOutlineMail } from "react-icons/hi";
import { FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-screen bg-gray-50 px-5 sm:px-20 py-12">
      <div className="flex flex-wrap items-end">
        <div className="mr-auto mb-10 md:mb-0">
          <Image src="/logo.png" width={40} height={40} />
          <div>
            <p className="font-medium mt-2">
              AFEN &copy; {new Date().getFullYear()}
            </p>
            <p className="md:w-96 mt-1 text-xs">
              A leading hub for African Blockchain-related collaborations with a
              focus on Decentralized Finance, Arts, Real Estate and Education.
            </p>
          </div>
        </div>
        <a
          href="https://www.instagram.com/afenblockchain/"
          target="_blank"
          className="mr-5"
        >
          <GrInstagram className="text-2xl" />
        </a>
        <a
          href="https://twitter.com/Afenblockchain?s=08"
          target="_blank"
          className="mr-5"
        >
          <GrTwitter className="text-2xl" />
        </a>
        <a href="mailto:afen@afengroup.com" target="_blank" className="mr-5">
          <HiOutlineMail className="text-2xl" />
        </a>
        <a href="https://t.me/afenblockchain" target="_blank" className="mr-5">
          <FaTelegramPlane className="text-2xl" />
        </a>
        <a href="https://link.medium.com/dJY0veBUlgb" target="_blank">
          <GrMedium className="text-2xl" />
        </a>
      </div>
    </footer>
  );
}
