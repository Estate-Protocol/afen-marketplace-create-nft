import React from "react";
import { BaseComponent } from "../../types/BaseComponent";
import { handleClickOutside } from "../../utils/misc";

export interface DialogProps extends BaseComponent {
  width?: string;
  isOpen?: boolean;
  onCloseDialog?: () => void;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  isOpen,
  onCloseDialog,
}) => {
  const node = React.useRef();

  const handleClickOutside = (e: { target: any }) => {
    // @ts-ignore
    if (node?.current?.contains(e.target)) {
      return;
    }

    // outside click
    onCloseDialog();
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return isOpen ? (
    <div
      ref={node}
      className="absolute left-0 top-0 h-screen w-full bg-black bg-opacity-60 z-50 flex flex-col justify-center overscroll-none"
    >
      <div className="w-10/12 md:w-auto bg-white dark:bg-afen-blue mx-auto rounded-2xl p-5 md:p-6 shadow-lg">
        {children}
      </div>
    </div>
  ) : (
    <div></div>
  );
};
