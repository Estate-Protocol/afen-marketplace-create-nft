import React from "react";
import classNames from "classnames";
import { BaseComponent } from "../../types/BaseComponent";

interface FlexProps extends BaseComponent {
  spaceBetween?: boolean;
  start?: boolean;
  wrap?: boolean;
  smAndUp?: boolean;
  style?: string;
  col?: boolean;
  center?: boolean;
  spaceAround?: boolean;
}

export default function Flex({
  children,
  style,
  spaceBetween,
  start,
  col,
  center,
  wrap,
  smAndUp,
  spaceAround,
  onClick,
}: FlexProps) {
  return (
    <div
      className={classNames(
        " w-full",
        smAndUp ? "md:flex" : "flex",
        start ? "items-start" : "items-end ",
        { "flex-wrap md:flex-nowrap": wrap },
        { "justify-between": spaceBetween },
        { "flex-col": col },
        { "items-center": center },
        { "justify-around": spaceAround },
        style
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
