"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, label, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={onClick}
    >
      {label}
      {isActive && (
        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
      )}
    </Link>
  );
}

export function NavLinks({
  mobile = false,
  onClick,
}: {
  mobile?: boolean;
  onClick?: () => void;
}) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/address", label: "Address" },
    // { href: "/services", label: "Services" },
    // { href: "/projects", label: "Projects" },
    // { href: "/contact", label: "Contact" },
  ];

  return (
    <div
      className={cn(
        "flex gap-1",
        mobile ? "flex-col items-start gap-4" : "items-center"
      )}
    >
      {links.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          onClick={onClick}
          className={mobile ? "text-lg w-full" : ""}
        />
      ))}
    </div>
  );
}
