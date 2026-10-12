import type { ComponentProps } from "react";

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`mx-auto w-full max-w-5xl ${className}`}
      {...props}
    />
  );
}
