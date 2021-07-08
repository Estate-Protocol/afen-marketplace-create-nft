import React from "react";
import { BaseComponent } from "../../types/BaseComponent";
import Loader from "react-loader-spinner";
import classNames from "classnames";

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
        buttonStyle += classNames(
          "px-6 py-2 rounded-full bg-afen-yellow text-black focus:outline-none",
          { "text-gray-500 bg-opacity-80 cursor-default": disabled }
        );
        break;
      case ButtonType.SECONDARY:
        buttonStyle += classNames(
          "px-5 py-2 bg-black text-white rounded-full border-2 border-black",
          { "text-gray-200 bg-opacity-80 cursor-default": disabled }
        );
        break;
      case ButtonType.OUTLINED:
        buttonStyle += classNames(
          "px-5 py-2 rounded-full border-2 border-black",
          { "border-gray-500 cursor-default": disabled }
        );
        break;
      case ButtonType.PLAIN:
        buttonStyle += classNames(
          `px-0 ${"hover:text-gray-600 dark:hover:text-gray-300"}`,
          { "text-gray-400 cursor-default": disabled }
        );
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
    } ${block ? "w-full py-4" : ""}
    ${buttonSize}
    ${style ? style : null}`;
  };

  return (
    <button
      className={getButtonStyle()}
      onClick={disabled ? undefined : onClick}
      onFocus={onFocus}
      type={inputType}
      disabled={disabled || loading}
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
