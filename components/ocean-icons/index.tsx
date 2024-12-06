import { SVGProps } from "react";

export function Wave(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12c.8-.6 2.7-2 4-2 1.3 0 3.2 1.4 4 2 .8.6 2.7 2 4 2 1.3 0 3.2-1.4 4-2" />
      <path d="M2 17c.8-.6 2.7-2 4-2 1.3 0 3.2 1.4 4 2 .8.6 2.7 2 4 2 1.3 0 3.2-1.4 4-2" />
      <path d="M2 7c.8-.6 2.7-2 4-2 1.3 0 3.2 1.4 4 2 .8.6 2.7 2 4 2 1.3 0 3.2-1.4 4-2" />
    </svg>
  );
}

export function Fish(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.5 12c.7-1.4 1.9-2.5 3.3-3.1 1.4-.6 3-.6 4.4 0 1.4.6 2.6 1.7 3.3 3.1.7 1.4.7 3 0 4.4-.7 1.4-1.9 2.5-3.3 3.1-1.4.6-3 .6-4.4 0-1.4-.6-2.6-1.7-3.3-3.1-.7-1.4-.7-3 0-4.4z" />
      <path d="M18 12h4" />
      <path d="M2 12h4" />
      <circle cx="12" cy="12" r="1" />
      <path d="m19 9-3 3 3 3" />
    </svg>
  );
}

export function Anchor(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="22" x2="12" y2="8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
  );
}

export function Shell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3c-1.5 0-2.9.6-3.9 1.6S6.5 7 6.5 8.5c0 1.5.6 2.9 1.6 3.9s2.4 1.6 3.9 1.6 2.9-.6 3.9-1.6 1.6-2.4 1.6-3.9-.6-2.9-1.6-3.9S13.5 3 12 3z" />
      <path d="M12 8.5c0-1.5-.6-2.9-1.6-3.9S8 3 6.5 3 3.6 3.6 2.6 4.6 1 7 1 8.5s.6 2.9 1.6 3.9S5 14 6.5 14s2.9-.6 3.9-1.6" />
      <path d="M12 8.5c0-1.5.6-2.9 1.6-3.9S16 3 17.5 3s2.9.6 3.9 1.6S23 7 23 8.5s-.6 2.9-1.6 3.9S19 14 17.5 14s-2.9-.6-3.9-1.6" />
      <path d="M12 8.5V21" />
    </svg>
  );
}
