import React from "react";

import "./PageHeader.scss";

export default function PageHeader({ children }: React.PropsWithChildren<{}>) {
  return <section className="PageHeader">{children}</section>;
}
