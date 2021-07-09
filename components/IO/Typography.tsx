import React from "react";
import { BaseComponent } from "../../types/BaseComponent";

interface TypographyProps extends BaseComponent {
  size?: "large" | "medium" | "small" | "x-small" | "default";
  sub?: boolean;
  bold?: boolean;
  truncate?: boolean;
  textWidth?: string;
  readMore?: boolean;
  readMoreAt?: number;
}

export default function Typography({
  children,
  style,
  sub,
  bold,
  size = "default",
  truncate,
  textWidth,
  readMore,
  readMoreAt,
  onClick,
}: TypographyProps) {
  const [isReadMore, setIsReadMore] = React.useState(readMore);

  const getTypographySize = () => {
    switch (size) {
      case "large":
        return "text-xl md:text-2xl";
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
    .replace(/,/g, " ");

  const sliceAt = readMoreAt || 150;

  return (
    <p
      className={classNames}
      style={truncate && { lineClamp: 3, boxOrient: "vertical" }}
      onClick={onClick}
    >
      {isReadMore &&
      typeof children === "string" &&
      children.length > sliceAt ? (
        <>
          {children.slice(0, sliceAt)}
          <span
            onClick={() => setIsReadMore(!isReadMore)}
            className="font-bold cursor-pointer"
          >
            {isReadMore ? "...read more" : " show less"}
          </span>
        </>
      ) : (
        children
      )}
    </p>
  );
}
