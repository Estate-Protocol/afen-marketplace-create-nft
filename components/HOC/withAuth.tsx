// HOC/withAuth.jsx
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import useAuth from "../../hooks/useAuth";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { toggleLoginDialog } = useAuth();

    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const token = cookieCutter.get("authToken");

      console.log(token);

      // If there is no access token we redirect to "/" page.
      if (!token || token === undefined) {
        Router.replace("/");
        toggleLoginDialog(true);
        return null;
      }

      // If this is an accessToken we just render the component that was passed with all its props
      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;
