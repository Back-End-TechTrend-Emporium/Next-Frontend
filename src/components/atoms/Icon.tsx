import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  name: "search" | "heart" | "cart" | "user" | "chevron-down" | "user-circle";
};

export default function Icon({ name, ...props }: IconProps) {
  switch (name) {
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
          <path d="M12 21s-6-4.35-9-7.35C-1 9.35 3 3 8 5.5 9.6 6.23 11 8 12 9.5 13 8 14.4 6.23 16 5.5 21 3 25 9.35 21 13.65 18 16.65 12 21 12 21Z" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "cart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
          <path d="M3 4h2l3 12h9l3-8H7" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="20" r="1.75" />
          <circle cx="18" cy="20" r="1.75" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
          <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "user-circle":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <circle cx="12" cy="12" r="9" strokeWidth={2.25} />
          <circle cx="12" cy="10" r="3" strokeWidth={2.25} />
          <path d="M6.5 18c1.9-3.1 9.1-3.1 11 0" strokeWidth={2.25} />
        </svg>
      );
    case "user":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
          <circle cx="12" cy="8" r="4" strokeWidth="2" />
          <path d="M4 20c1.8-3.5 6-4.5 8-4.5s6.2 1 8 4.5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
