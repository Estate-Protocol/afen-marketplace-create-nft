import React from "react";
import { BaseComponent } from "../../types/BaseComponent";

export default function CardText({ children, onClick }: BaseComponent) {
  return (
    <div onClick={onClick}>
      <div className="bg-white dark:bg-rich-black dark:text-white py-3 px-3 font-normal">
        {children}
      </div>
    </div>
  );
}
