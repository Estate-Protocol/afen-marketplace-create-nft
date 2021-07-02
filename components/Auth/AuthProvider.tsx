import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { User } from "../../types/User";

const protectedRoutes = ["/create", "/user"];

export interface LoginInput extends Pick<User, "email" | "password"> {}

export interface IAuthContext {
  isAuthenticated: boolean;
  loginDialog: boolean;
  registerDialog: boolean;
  toggleLoginDialog: (value?: boolean) => void;
  toggleRegisterDialog: (value?: boolean) => void;
  login: (data: LoginInput) => Promise<void>;
  register: (data: User) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContext>({
  isAuthenticated: false,
  loginDialog: false,
  registerDialog: false,
  toggleLoginDialog: undefined,
  toggleRegisterDialog: undefined,
  login: undefined,
  register: undefined,
  logout: undefined,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDialog, setLoginDialog] = useState<boolean>(false);
  const [registerDialog, setRegisterDialog] = useState<boolean>(false);

  const { route, push: routeTo } = useRouter();

  useEffect(() => {
    // handling protected routes
    if (protectedRoutes.includes(route)) {
      if (!isAuthenticated) {
        // display login dialog
        // TODO: improve by preventing next route rather than routing to home
        routeTo("/");
        setLoginDialog(true);
      }
    }
  }, [route]);

  const login = (data: LoginInput): any => {
    // login user
    // setLoginDialog(false);
  };

  const register = (data: User): any => {
    // register user
  };

  const logout = () => {
    // logout user
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginDialog,
        registerDialog,
        toggleLoginDialog: (value) => setLoginDialog(value || !loginDialog),
        toggleRegisterDialog: (value) =>
          setRegisterDialog(value || !registerDialog),
        login,
        register,
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
