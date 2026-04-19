"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Sparkles, User } from "lucide-react";

const tabs = [
  { href: "/swipe", label: "Swipe", icon: Sparkles },
  { href: "/matches", label: "Matches", icon: Heart },
  { href: "/profile", label: "You", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="glass fixed bottom-0 left-0 right-0 z-30 border-t border-white/40 px-4"
      style={{ paddingBottom: "calc(var(--safe-bottom) + 0.5rem)", paddingTop: "0.5rem" }}
    >
      <ul className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-white text-peach-700 shadow-soft"
                    : "text-slate-500 hover:text-peach-500"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
