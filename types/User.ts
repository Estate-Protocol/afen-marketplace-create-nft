import { BaseType } from "./BaseType";

export interface User extends BaseType {
  name: string;
  email: string;
  password: string;
  wallet: string;
  twitter?: string;
  instagram?: string;
  avatar?: string;
  banner?: string;
  portfolio?: string;
  description?: string;
  balance: number;
  // token?: string;
}
