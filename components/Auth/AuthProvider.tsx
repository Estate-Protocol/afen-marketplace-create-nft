import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { User } from "../../types/User";

const protectedRoutes = ["/create", "/user"];

export interface LoginInput extends Pick<User, "email" | "password"> {}

export interface IAuthContext {
  isAuthenticated: boolean;
  loginDialog: boolean;
  onCloseLoginDialog: () => void;
  login: (data: LoginInput) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  isAuthenticated: false,
  loginDialog: false,
  onCloseLoginDialog: undefined,
  login: undefined,
  logout: undefined,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);

  const { route, push: routeTo } = useRouter();

  useEffect(() => {
    // handling protected routes
    if (protectedRoutes.includes(route)) {
      if (!isAuthenticated) {
        // display login dialog
        routeTo("/");
        setLoginDialog(true);
      }
    }
  }, [route]);

  const login = (data: LoginInput): any => {
    // login user
    setLoginDialog(false);
  };

  const logout = () => {
    // logout user
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginDialog,
        onCloseLoginDialog: () => setLoginDialog(false),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContext.displayName = "AuthContext";
export const Auth = AuthContext.Consumer;
export default Auth;
