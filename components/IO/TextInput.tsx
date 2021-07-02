import React, { ReactNode } from "react";
import Typography from "./Typography";
import { slugifyText } from "../../utils/misc";
import classnames from "classnames";
import CheckBox from "./CheckBox";

interface TextInput {
  label: string;
  description?: string;
  type?: "text" | "number" | "email" | "password" | "search" | "tel";
  value?: string | number;
  disabled?: boolean;
  icon?: ReactNode;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  error?: string;
  success?: string | boolean;
  append?: ReactNode | string;
  prepend?: ReactNode | string;
  persistDescription?: boolean;
  onChange?: (text: any) => void;
}

export default function TextInput({
  label,
  value,
  icon,
  type = "text",
  placeholder,
  description,
  required,
  disabled,
  min,
  max,
  append,
  prepend,
  error,
  success,
  persistDescription,
  onChange,
}: TextInput) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="mb-5 w-full">
      <label htmlFor={slugifyText(label)}>
        <Typography sub bold size="small">
          {label}
          {required && <span className="text-black dark:text-white"> *</span>}
        </Typography>
      </label>
      <div
        className={classnames(
          "inline-flex items-center w-full mt-2 border-2  rounded-full px-4 py-2 focus:border-blue-500 dark:border-gray-500",
          { "border-red-500": error },
          { "border-green-500": success }
        )}
      >
        {icon}
        {prepend && <div className="mr-2">{prepend}</div>}
        <input
          name={slugifyText(label)}
          value={value}
          type={showPassword ? "text" : type}
          pattern={type === "number" && "^[0-9]"}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          className={`py-1 dark:bg-afen-blue focus:outline-none w-full ${
            disabled ? "text-gray-600" : "dark:text-gray-300"
          }`}
          onChange={(e) => onChange(e.target.value)}
        />
        {append && <div className="ml-2">{append}</div>}
      </div>
      {(error || description) && (
        <Typography sub size="x-small" style="mt-2">
          {persistDescription ? description : error || description}
        </Typography>
      )}
      {type === "password" && (
        <div className="mt-1.5">
          <CheckBox
            label="Show Password"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          ></CheckBox>
        </div>
      )}
    </div>
  );
}
