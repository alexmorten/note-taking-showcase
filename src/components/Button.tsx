import React from "react";
import "./Button.scss";
interface Props {
  onClick(): void;
  small?: boolean;
  action?: boolean;
  danger?: boolean;
}

export default function Button({
  onClick,
  children,
  small,
  action,
  danger
}: React.PropsWithChildren<Props>) {
  return (
    <button
      className={`Button${small ? " small" : ""}${danger ? " danger" : ""}${
        action ? " action" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
