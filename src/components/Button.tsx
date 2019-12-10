import React from "react";

interface Props {
  onClick(): void;
}

export default function Button({
  onClick,
  children
}: React.PropsWithChildren<Props>) {
  return <button onClick={onClick}>{children}</button>;
}
