import React from "react";
import { BaseComponent } from "../../types/BaseComponent";

export default function Container({ children, style }: BaseComponent) {
  return (
    <div
      className={`px-5 md:px-10 lg:px-16 mx-auto overflow-x-hidden w-full mt-24 md:mt-32 mb-20 ${style}`}
    >
      {children}
    </div>
  );
}
