'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  SquaresFour,
  Robot,
  Database,
  GitBranch,
  PuzzlePiece,
  List,
  X,
  Lightning,
} from '@phosphor-icons/react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: SquaresFour },
  { href: '/agents', label: 'Agents', icon: Robot },
  { href: '/knowledge', label: 'Knowledge', icon: Database },
  { href: '/orchestration', label: 'Orchestration', icon: GitBranch },
  { href: '/skills', label: 'Skills', icon: PuzzlePiece },
];

const springConfig = { type: 'spring' as const, stiffness: 100, damping: 20 };

const menuVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: { ...springConfig, staggerChildren: 0.02, staggerDirection: -1 },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...springConfig, staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -12 },
  open: { opacity: 1, x: 0, transition: springConfig },
};

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    document.body.prepend(sentinel);
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => { observer.disconnect(); sentinel.remove(); };
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Fluid Island Nav Pill */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springConfig, delay: 0.2 }}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-6"
      >
        <div className={`
          flex items-center gap-1 px-3 py-2 rounded-full
          bg-[#0a0a0a]/80 backdrop-blur-3xl
          border border-white/[0.06]
          shadow-[0_8px_32px_rgba(0,0,0,0.6)]
          transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${scrolled ? 'shadow-[0_12px_48px_rgba(0,0,0,0.8)]' : ''}
        `}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 mr-2 group">
            <div className="relative w-7 h-7 flex items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/20">
              <Lightning weight="fill" className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors duration-500">
              ROSTR
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${isActive
                      ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <Icon weight={isActive ? 'fill' : 'regular'} className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* System Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 ml-2 border-l border-white/[0.06]">
            <span className="status-dot-active" />
            <span className="text-[10px] text-white/30 font-mono tracking-wider">LIVE</span>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-500 ml-1"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X weight="regular" className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <List weight="regular" className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-24 left-4 right-4 z-50 md:hidden"
            >
              <div className="db-outer">
                <div className="db-inner-glass p-4">
                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <motion.div key={item.href} variants={itemVariants}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                              transition-all duration-500
                              ${isActive
                                ? 'bg-white/[0.08] text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                              }
                            `}
                          >
                            <Icon weight={isActive ? 'fill' : 'regular'} className="w-5 h-5" />
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
