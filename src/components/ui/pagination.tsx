import * as React from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

export function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />;
}

export function PaginationLink({
  className,
  isActive,
  children,
  ...props
}: React.ComponentProps<"a"> & { isActive?: boolean }) {
  return (
    <a
      className={cn(
        "px-3 py-1 rounded-md border text-sm hover:bg-gray-100 transition flex items-center gap-2",
        isActive ? "bg-gray-200 font-semibold" : "bg-white",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function PaginationPrevious({ "aria-label": ariaLabel, children, ...props }: React.ComponentProps<"a">) {
  const locale = useLocale();
  const Icon = locale === "ar" ? FaChevronRight : FaChevronLeft;
  return (
    <PaginationLink {...props} aria-label={ariaLabel || (locale === "ar" ? "Previous (rtl)" : "Previous")}>
      <Icon aria-hidden="true" />
      <span className="sr-only">Previous</span>
      {children}
    </PaginationLink>
  );
}

export function PaginationNext({ "aria-label": ariaLabel, children, ...props }: React.ComponentProps<"a">) {
  const locale = useLocale();
  const Icon = locale === "ar" ? FaChevronLeft : FaChevronRight;
  return (
    <PaginationLink {...props} aria-label={ariaLabel || (locale === "ar" ? "Next (rtl)" : "Next")}>
      <Icon aria-hidden="true" />
      <span className="sr-only">Next</span>
      {children}
    </PaginationLink>
  );
}
