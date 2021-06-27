import React from "react";
import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";
import useNotifier from "../../hooks/useNotifier";
import Title from "../IO/Title";
import Typography from "../IO/Typography";
import Button from "../IO/Button";
import Container from "./Container";

export default function Body({ children }) {
  const { data: notification, close: closeNotification } = useNotifier();

  return (
    <>
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
              <Title style="mb-2">{notification?.title}</Title>
              <Typography bold style="mb-5">
                {notification.text}
              </Typography>
              <Button block type="primary" onClick={() => closeNotification()}>
                Close
              </Button>
            </div>
          </div>
        )}
        <div>{children}</div>
        <Footer />
      </div>
    </>
  );
}
