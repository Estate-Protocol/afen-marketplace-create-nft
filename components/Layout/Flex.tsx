import React from "react";

interface FlexProps {
  spaceBetween?: boolean;
  start?: boolean;
  wrap?: boolean;
  smAndUp?: boolean;
  children: any;
  style?: string;
  col?: boolean;
  center?: boolean;
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
}: FlexProps) {
  return (
    <div
      className={`${smAndUp ? "md:flex" : "flex"} w-full ${
        start ? "items-start " : "items-end "
      }
      ${wrap ? `flex-wrap md:flex-nowrap ` : ""}
      ${spaceBetween ? "justify-between " : ""}
      ${col ? "flex-col " : ""} 
      ${center ? "items-center " : ""} 
      ${style} `}
    >
      {children}
    </div>
  );
}
