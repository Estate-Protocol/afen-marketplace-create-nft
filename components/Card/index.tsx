import React from "react";
import CardMedia from "./CardMedia";
import CardText from "./CardText";
import CardAvatar from "./CardAvatar";
import { BaseComponent } from "../../types/BaseComponent";

interface CardProps extends BaseComponent {
  light?: boolean;
}

export default function Card({ children, style, onClick }: CardProps) {
  return (
    <div className="w-80" onClick={onClick}>
      <div className="group w-80 min-w-full">
        <div
          className={`min-h-96 h-96 cursor-pointer border-afen-blue-lighter shadow-md dark:text-black overflow-hidden ${style}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export { CardMedia, CardText, CardAvatar };
