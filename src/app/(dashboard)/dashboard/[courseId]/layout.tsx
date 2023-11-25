import React from "react";

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return <div className="p-10">{children}</div>;
}
