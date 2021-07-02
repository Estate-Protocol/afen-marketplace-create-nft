import React from "react";
import { BaseComponent } from "../../types/BaseComponent";
import { slugifyText } from "../../utils/misc";
import Typography from "./Typography";

export interface CheckBoxInputProps extends BaseComponent {
  label: string;
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  persistDescription?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

export default function CheckBox({
  checked,
  label,
  required,
  disabled,
  error,
  description,
  persistDescription,
  onChange,
}: CheckBoxInputProps) {
  return (
    <div className="mb-5 w-full">
      <div className="inline-flex items-center">
        <input
          name={slugifyText(label)}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="border-red-400"
          onChange={(e) => (onChange ? onChange(e.target.value) : undefined)}
        />
        <label htmlFor={slugifyText(label)} className="ml-2">
          <Typography bold sub >
            {label}
            {required && <span className="text-black dark:text-white"> *</span>}
          </Typography>
        </label>
      </div>
      {(error || description) && (
        <Typography sub size="x-small" style="mt-2">
          {persistDescription ? description : error || description}
        </Typography>
      )}
    </div>
  );
}
