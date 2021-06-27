import { ReactNode } from "react";

export interface BaseComponent {
  children?: ReactNode | Element[];
  style?: string;
  onClick?: () => void;
}
