import { User } from "../../User/types/User";

export interface Login {
  message: string;
  user?: User;
  token?: string;
}
