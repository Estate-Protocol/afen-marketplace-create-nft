import React, { ReactNode } from "react";
import Typography from "./Typography";
import { slugifyText } from "../../utils/misc";

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
  append?: ReactNode | string;
  prepend?: ReactNode | string;
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
  onChange,
}: TextInput) {
  const borderColor = [error ? "border-red-500" : "dark:border-gray-500"];

  return (
    <div className="mb-5 w-full">
      <label htmlFor={slugifyText(label)}>
        <Typography bold size="small">
          {label}
          {required && <span className="text-black dark:text-white"> *</span>}
        </Typography>
      </label>
      <div
        className={`inline-flex items-center w-full mt-2 border-2 ${borderColor} rounded-full px-4 py-2 focus:border-blue-500`}
      >
        {icon}
        {prepend && <div className="mr-2">{prepend}</div>}
        <input
          name={slugifyText(label)}
          value={value}
          type={type}
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
          {error || description}
        </Typography>
      )}
    </div>
  );
}
