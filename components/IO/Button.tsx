import React from "react";
import { BaseComponent } from "../../types/BaseComponent";
import Loader from "react-loader-spinner";

enum ButtonType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  OUTLINED = "outlined",
  PLAIN = "plain",
}

interface ButtonProps extends BaseComponent {
  id?: string;
  url?: string;
  type?: "primary" | "secondary" | "outlined" | "plain";
  size?: "small" | "medium" | "large";
  variant?: "add" | "delete";
  hover?: boolean;
  inputType?: "button" | "submit" | "reset";
  icon?: boolean;
  plain?: boolean;
  block?: boolean;
  external?: boolean;
  submit?: boolean;
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  accessibilityLabel?: string;
  role?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaDescribedBy?: string;
  onClick?(): void;
  onFocus?(): void;
  onBlur?(): void;
  onKeyPress?(event: React.KeyboardEvent<HTMLButtonElement>): void;
  onKeyUp?(event: React.KeyboardEvent<HTMLButtonElement>): void;
  onKeyDown?(event: React.KeyboardEvent<HTMLButtonElement>): void;
}

export default function Button({
  children,
  style,
  size,
  inputType,
  type = "primary",
  hover = true,
  icon,
  block,
  disabled,
  loading,
  onClick,
  onFocus,
}: ButtonProps) {
  const getButtonStyle = (): string => {
    const defaultStyle = "font-semibold focus:outline-none text-center";

    let buttonStyle = "text-md ";
    let buttonSize = "";

    switch (type) {
      case ButtonType.PRIMARY:
        buttonStyle +=
          "px-6 py-2 rounded-full bg-afen-yellow text-black focus:outline-none";
        break;
      case ButtonType.SECONDARY:
        buttonStyle +=
          "px-5 py-2 rounded-full border-2 border-black";
        break;
      case ButtonType.OUTLINED:
        buttonStyle += "rounded border-2 border-almond bg-none";
        break;
      case ButtonType.PLAIN:
        buttonStyle += `px-0 ${
          hover ? "hover:text-gray-600 dark:hover:text-gray-300" : ""
        } `;
        break;
      default:
        buttonStyle += "";
    }

    switch (size) {
      case "large":
        buttonSize += "px-10";
        break;
      case "medium":
        buttonSize += "text-md";
        break;
      case "small":
        buttonSize += "text-sm";
        break;
      default:
        buttonSize += "text-sm";
    }

    return `${defaultStyle} ${buttonStyle} ${
      icon || loading ? "inline-flex items-center justify-center w-full" : ""
    } ${block ? "w-full py-4" : ""} ${
      disabled
        ? "text-gray-500 bg-black text-white hover:text-gray-500 cursor-default"
        : ""
    }
    ${buttonSize}
    ${style ? style : null}`;
  };

  return (
    <button
      className={getButtonStyle()}
      onClick={disabled ? undefined : onClick}
      onFocus={onFocus}
      type={inputType}
    >
      {children}
      {loading && (
        <span className="ml-2">
          <Loader type="Oval" color="#ffffff" height={20} width={20} />
        </span>
      )}
    </button>
  );
}
