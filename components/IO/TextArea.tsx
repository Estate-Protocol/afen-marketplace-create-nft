import React, { ReactNode } from "react";
import Typography from "../IO/Typography";
import { slugifyText } from "../../utils/misc";
import classNames from "classnames";

interface TextAreaProps {
  label: string;
  description?: string;
  rows?: number;
  value?: string | number;
  disabled?: boolean;
  icon?: ReactNode;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  error?: string;
  success?: string | boolean;
  persistDescription?: boolean;
  prepend?: ReactNode | string;
  onChange?: (text: any) => void;
}

export default function TextArea({
  label,
  value,
  icon,
  rows,
  placeholder,
  description,
  required,
  disabled,
  error,
  success,
  prepend,
  persistDescription,
  onChange,
}: TextAreaProps) {
  return (
    <div className="mb-5 w-full">
      <label htmlFor={slugifyText(label)}>
        <Typography bold size="small">
          {label}
          {required && <span className="text-black dark:text-white"> *</span>}
        </Typography>
      </label>
      <div
        className={classNames(
          "inline-flex items-center w-full mt-2 border-2 dark:border-gray-500 rounded-xl px-4 py-2 focus:border-blue-500",
          { "border-red-500": error },
          { "border-green-500": success }
        )}
      >
        {icon}
        <textarea
          name={slugifyText(label)}
          value={value}
          rows={rows || 4}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`py-1 dark:bg-afen-blue focus:outline-none w-full ${
            disabled ? "text-gray-600" : "dark:text-gray-300"
          }`}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="ml-2">{prepend}</div>
      </div>
      {(error || description) && (
        <Typography sub size="x-small" style="mt-2">
          {persistDescription ? description : error || description}
        </Typography>
      )}
    </div>
  );
}
