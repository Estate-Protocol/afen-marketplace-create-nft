import { AxiosError, AxiosResponse } from "axios";
import cookieCutter from "cookie-cutter";
import { User } from "../../../types/User";
import { api as axios } from "../../../utils/axios";
import { handleAxiosRequestError } from "../../../utils/misc";
import { LoginInput } from "../AuthProvider";

const authCookieName = "authToken";

/**
 * Login user
 * @param {LoginInput} data
 * @return {Promise<AxiosResponse<User>>} User
 */
export const login = async (data: LoginInput) => {
  const response = await axios.post<User>("/user/login", data);

  if (response.status === 200) {
    cookieCutter.set(authCookieName, response.data.token);
  }
  return response;
};

/**
 * Logout user
 */
export const logout = () => {
  cookieCutter.set(authCookieName, "", { expires: new Date(0) });
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

/**
 * Register user
 * @param {Omit<User, "_id" | "wallet" | "created_at" | "email">} data
 * @return {Promise<AxiosResponse<User>>} User
 */
export const updateUser = async (
  data: Omit<User, "_id" | "wallet" | "created_at" | "email">
): Promise<AxiosResponse<User>> => {
  try {
    const response = await axios.post("/user/register", data);

    return response.data;
  } catch (err) {
    handleAxiosRequestError(err);
  }
};

/**
 * Delete user - Not implmented
 */
export const deleteUser = () => {
  // Not implemented
};
