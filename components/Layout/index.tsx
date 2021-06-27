import React from "react";
import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";
import useNotifier from "../../hooks/useNotifier";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import { IoCloseSharp } from "react-icons/io5";
import Flex from "./Flex";

export default function Body({ children }) {
  const { data: notification, close: closeNotification } = useNotifier();

  const notificationColor = () => {
    if (notification.status === "error") {
      return "text-red-500";
    } else if (notification.status === "success") {
      return "text-green-500";
    }
  };

  return (
    <div className={notification ? "relative h-screen overflow-hidden" : ""}>
      <Head>
        <title>AFEN Art Marketplace</title>
        <meta
          name="description"
          content="AFEN has the objective of combining blockchain’s immutable data structure and the backing of government bodies to provide legitimacy to products"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/fonts/Manrope/Manrope-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Manrope/Manrope-Medium.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <div>
        <Header />
        {/* Notification */}
        {notification && (
          <div className="absolute left-0 top-0 h-screen w-full bg-black bg-opacity-60 z-50 flex flex-col justify-center overscroll-none">
            <div className="w-96 bg-white dark:bg-afen-blue mx-auto rounded-2xl p-8 shadow-lg">
              <Flex spaceBetween center style="mb-5">
                <Title style={`${notificationColor()}`}>
                  {notification?.title}
                </Title>
                <IoCloseSharp
                  className="text-3xl text-gray-400 cursor-pointer"
                  onClick={() => closeNotification()}
                />
              </Flex>
              <Typography sub bold style="mb-2">
                {notification.text}
              </Typography>
            </div>
          </div>
        )}
        <div>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
