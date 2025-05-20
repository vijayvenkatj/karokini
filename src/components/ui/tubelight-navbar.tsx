"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Home,
  LucideIcon,
  Music,
  User,
  UserRoundPlus,
  Music2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items?: NavItem[];
  className?: string;
}

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Player", url: "/player", icon: Music },
  { name: "Recorder", url: "/recorder", icon: Music2 },
  { name: "Sign In", url: "/signin", icon: User },
  { name: "Sign Up", url: "/signup", icon: UserRoundPlus },
];

export function NavBar({ items = navItems, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6 pointer-events-none",
        className
      )}
    >
      <div className="flex items-center gap-3 bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white",
                isActive &&
                  "bg-black/5 dark:bg-white/5 text-black dark:text-white"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-black/5 dark:bg-white/5 rounded-full -z-[1]"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-black dark:bg-white rounded-t-full">
                    <div className="absolute w-12 h-6 bg-black/20 dark:bg-white/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-black/20 dark:bg-white/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-black/20 dark:bg-white/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
