import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type CommonProps = {
  variant?: "primary" | "outline";
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps & {
  href?: string;
} & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement> &
      ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps | "href"
  >;

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200";

const sizeClasses = {
  sm: "min-h-[44px] px-4 py-2 text-[13px]",
  md: "min-h-[44px] px-5 py-3 text-sm",
};

const variantClasses = {
  primary: "bg-ink text-on-ink hover:bg-ink/90",
  outline: "border border-border bg-surface text-text hover:border-ink/40",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
