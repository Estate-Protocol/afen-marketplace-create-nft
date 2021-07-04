import axios from "axios";
// import cookieCutter from "cookie-cutter";

// Get a cookie
// const token = cookieCutter.get("authToken");

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    // Authorization: `JWT ${token}`,
  },
});
