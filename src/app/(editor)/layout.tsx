import React from "react";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto grid items-start gap-10 py-8">
      {props.children}
    </div>
  );
}
