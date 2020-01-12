import React from "react";
import "./Button.scss";
interface Props {
  onClick(): void;
  small?: boolean;
  white?: boolean;
  danger?: boolean;
}

export default function Button({
  onClick,
  children,
  small,
  white,
  danger
}: React.PropsWithChildren<Props>) {
  return (
    <button
      className={`Button${small ? " small" : ""}${danger ? " danger" : ""}${
        white ? " white" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
