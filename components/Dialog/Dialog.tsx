import React from "react";
import { BaseComponent } from "../../types/BaseComponent";
import { handleClickOutside } from "../../utils/misc";

export interface DialogProps extends BaseComponent {
  width?: string;
  onCloseDialog?: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ children, onCloseDialog }) => {
  const node = React.useRef();

  const handleClickOutside = (e: { target: any }) => {
    // @ts-ignore
    if (node.current.contains(e.target)) {
      return;
    }

    // outside click
    onCloseDialog();
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div
      ref={node}
      className="absolute left-0 top-0 h-screen w-full bg-black bg-opacity-60 z-50 flex flex-col justify-center overscroll-none"
    >
      <div className="w-10/12 md:w-auto bg-white dark:bg-afen-blue mx-auto rounded-2xl p-6 md:p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
};
