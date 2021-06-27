import React from "react";
import { BaseComponent } from "../../types/BaseComponent";

interface TypographyProps extends BaseComponent {
  size?: "large" | "medium" | "small" | "x-small" | "default";
  sub?: boolean;
  bold?: boolean;
  truncate?: boolean;
  textWidth?: string;
}

export default function Typography({
  children,
  style,
  sub,
  bold,
  size = "default",
  truncate,
  textWidth,
  onClick,
}: TypographyProps) {
  const getTypographySize = () => {
    switch (size) {
      case "medium":
        return "text-lg";
      case "medium":
        return "text-md";
      case "small":
        return "text-sm";
      case "x-small":
        return "text-xs";
      default:
        return "text-base";
    }
  };

  const classNames = [
    style,
    getTypographySize(),
    sub && "text-gray-500",
    "tracking-tight",
    truncate && textWidth && `truncate ${textWidth}`,
    bold && "font-semibold",
  ]
    .toString()
    .replaceAll(",", " ");

  return (
    <p
      className={classNames}
      style={truncate && { lineClamp: 3, boxOrient: "vertical" }}
      onClick={onClick}
    >
      {children}
    </p>
  );
}
