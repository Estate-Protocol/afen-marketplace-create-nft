// HOC/withAuth.jsx
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import useAuth from "../../hooks/useAuth";
import { authCookieName } from "../Auth/apis/auth";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { toggleLoginDialog, setIsAuthenticated } = useAuth();

    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const router = useRouter();

      const token = cookieCutter.get(authCookieName);

      // If there is no access token we redirect to "/" page.
      if (!token) {
        router.replace("/");
        setIsAuthenticated(false);
        toggleLoginDialog(true);
        return null;
      } else {
        setIsAuthenticated(true);
      }

      // If this is an accessToken we just render the component that was passed with all its props
      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;
