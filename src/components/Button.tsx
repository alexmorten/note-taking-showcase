import React from "react";
import "./Button.css";
interface Props {
  onClick(): void;
  small?: boolean;
  danger?: boolean;
}

export default function Button({
  onClick,
  children,
  small,
  danger
}: React.PropsWithChildren<Props>) {
  return (
    <button
      className={`Button${small ? " small" : ""}${danger ? " danger" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
