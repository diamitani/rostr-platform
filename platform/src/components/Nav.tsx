"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  House,
  Robot,
  Gear,
  Question,
  List,
  X,
} from "@phosphor-icons/react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Dashboard", icon: House },
  { href: "/agents", label: "Agents", icon: Robot },
  { href: "/settings", label: "Settings", icon: Gear },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4">
      <div className="glass-card px-4 py-2.5 flex items-center gap-1 max-w-lg w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mr-4 group"
        >
          <span className="text-cyan font-bold text-lg tracking-tight font-mono">
            ROSTR
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono group-hover:text-white/50 transition-colors">
            Platform
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-0.5 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                  active
                    ? "bg-cyan/10 text-cyan"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                )}
              >
                <Icon
                  weight={active ? "fill" : "regular"}
                  className="w-4 h-4"
                />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Help + Mobile toggle */}
        <div className="flex items-center gap-1 ml-auto">
          <Link
            href="/onboarding"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
            title="Help & Onboarding"
          >
            <Question className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-1.5 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <List className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ stiffness: 100, damping: 20 }}
          className="absolute top-full left-4 right-4 mt-2 glass-card p-2 flex flex-col gap-0.5 sm:hidden"
        >
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                  active
                    ? "bg-cyan/10 text-cyan"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                )}
              >
                <Icon
                  weight={active ? "fill" : "regular"}
                  className="w-4 h-4"
                />
                {link.label}
              </Link>
            );
          })}
        </motion.div>
      )}
    </nav>
  );
}
