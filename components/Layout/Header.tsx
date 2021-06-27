import React from "react";
import Image from "next/image";
import Link from "next/Link";
import Button from "../IO/Button";
import { useRouter } from "next/dist/client/router";

export default function Header() {
  const router = useRouter();

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
        <div className="ml-auto">
          {/* <a
            href="https://link.medium.com/d6ni1B0ATgb"
            className={
              "text-sm sm:text-base px-6 py-2 rounded-full text-black font-medium inline-flex items-center underline"
            }
            target="_blank"
          >
            Get Started
          </a> */}
          <Button type="primary" onClick={() => router.push("/create")}>
            Create NFT
          </Button>
        </div>
      </div>
    </header>
  );
}
