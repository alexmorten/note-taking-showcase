import React from "react";
import "./Button.css";
interface Props {
  onClick(): void;
  small?: boolean;
}

export default function Button({
  onClick,
  children,
  small
}: React.PropsWithChildren<Props>) {
  return (
    <button className={`Button${small ? " small" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}
