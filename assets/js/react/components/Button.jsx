import classNames from "classnames";
import React from "react";

export const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      type="button"
      className={classNames(
        "rounded-lg bg-zinc-900 hover:bg-zinc-700 py-2 px-3",
        "text-sm font-semibold leading-6 text-white active:text-white/80",
        className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
