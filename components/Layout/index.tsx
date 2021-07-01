import React from "react";
import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";
import useNotifier from "../../hooks/useNotifier";
import ProgressBar from "nextjs-progressbar";
import Notification from "../Notification/NotificationDialog";
import useAuth from "../../hooks/useAuth";
import { LoginDialog } from "../User/LoginDialog";
import classnames from "classnames";

export default function Body({ children }) {
  const { data: notification, close: closeNotification } = useNotifier();
  const { loginDialog, onCloseLoginDialog } = useAuth();

  const dialogOpen = notification || loginDialog;

  return (
    <>
      <ProgressBar
        color="#f8da56"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ showSpinner: false }}
      />
      <div
        className={classnames({
          "relative h-screen overflow-hidden": dialogOpen,
        })}
      >
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
            <Notification data={notification} close={closeNotification} />
          )}

          {/* Login Dialog */}
          {loginDialog && <LoginDialog close={onCloseLoginDialog} />}

          <div>{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
}
