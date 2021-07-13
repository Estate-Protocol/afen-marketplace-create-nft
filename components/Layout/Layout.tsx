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
import { RegisterDialog } from "../User/RegisterDialog";
import withAuth from "../HOC/withAuth";

export default function Layout({ children }) {
  const { data: notification, close: closeNotification } = useNotifier();
  const {
    loginDialog,
    registerDialog,
    message,
    toggleLoginDialog,
    toggleRegisterDialog,
    register,
    login,
  } = useAuth();

  const dialogOpen = notification || loginDialog || registerDialog;

  const toggleAuthDialogs = () => {
    toggleLoginDialog();
    toggleRegisterDialog();
  };

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
          "relative h-screen overflow-hidden overscroll-contain": dialogOpen,
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
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          ></script>
          <meta
            content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
            name="viewport"
          />
          <meta name="viewport" content="width=device-width" />
        </Head>
        <div className="flex flex-col min-h-screen justify-between">
          <Header />
          {/* Notification */}
          {notification && (
            <Notification data={notification} close={closeNotification} />
          )}

          {/* Login Dialog */}
          {loginDialog && (
            <LoginDialog
              message={message}
              isOpen={loginDialog}
              toggle={toggleLoginDialog}
              onOpenRegisterDialog={toggleAuthDialogs}
              onLogin={login}
            />
          )}

          {/* Register Dialog */}
          {registerDialog && (
            <RegisterDialog
              message={message}
              isOpen={registerDialog}
              toggle={toggleRegisterDialog}
              onOpenLoginDialog={toggleAuthDialogs}
              onRegister={register}
            />
          )}

          <div>{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
}
