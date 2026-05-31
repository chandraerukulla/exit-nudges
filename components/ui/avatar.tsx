"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-tertiary text-on-surface-primary",
  {
    variants: {
      size: {
        xs: "h-24 w-24 type-labelSm",
        sm: "h-32 w-32 type-labelMd",
        md: "h-40 w-40 type-labelHeavyMd",
        lg: "h-48 w-48 type-labelHeavyLg",
        xl: "h-64 w-64 type-titleMd",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt = "", fallback, ...props }, ref) => {
    const [errored, setErrored] = React.useState(false);
    const showImage = src && !errored;
    const initials = (fallback ?? alt ?? "?")
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div ref={ref} className={cn(avatarVariants({ size }), className)} {...props}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
