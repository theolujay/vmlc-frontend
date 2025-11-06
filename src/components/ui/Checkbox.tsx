import { ChangeEvent } from "react";
import { CheckedIcon, UncheckedIcon } from "./SvgAsset/GeneralAsset";


export const Checkbox = ({
  checked,
  onChange,
  id,
  disabled = false,
}: {
  id?:string
  checked?: boolean;
  onChange?: (checked: boolean, event?: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) => {
  return (
    <label className="inline-block cursor-pointer">
      <input
      id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e.target.checked, e);
        }}
      />

      <span className="unchecked">
        <UncheckedIcon />
      </span>
      <span className="checked">
        <CheckedIcon />
      </span>

      <style jsx>{`
        .unchecked {
          display: block;
        }
        .checked {
          display: none;
        }

        input {
          display: none;
        }

        input:checked ~ .unchecked {
          display: none;
        }

        input:checked ~ .checked {
          display: block;
        }

        input:disabled ~ .unchecked {
          opacity: 0.5;
          cursor: auto;
        }

        input:disabled ~ .checked {
          opacity: 0.5;
          cursor: auto;
        }
      `}</style>
    </label>
  );
};
