import { AxiosResponse } from "axios";
import cookieCutter from "cookie-cutter";
import { User } from "../../../types/User";
import { api as axios } from "../../../utils/axios";
import { LoginInput } from "../AuthProvider";

export const authCookieName = "authToken";

/**
 * Login user
 * @param {LoginInput} data
 * @return {Promise<AxiosResponse<User>>} User
 */
export const login = async (data: LoginInput) => {
  const response = await axios.post("/user/login", data);

  if (response.status === 200) {
    await cookieCutter.set(authCookieName, response.data.token);
  }
  return response;
};

/**
 * Logout user
 */
export const logout = async () => {
  await cookieCutter.set(authCookieName, "", { expires: new Date(0) });
};

/**
 * Register user
 * @param {User} data
 * @return {Promise<User> | AxiosError} User
 */
export const register = async (data: User): Promise<AxiosResponse<User>> => {
  const response = await axios.post("/user/register", data);

  return response;
};
