import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 md:px-8">{children}</div>
  );
}
