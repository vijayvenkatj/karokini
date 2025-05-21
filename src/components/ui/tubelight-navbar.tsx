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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/zustand/AuthStore";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  auth?: boolean;
}

interface NavBarProps {
  items?: NavItem[];
  className?: string;
}

const defaultNavItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Player", url: "/player", icon: Music },
  { name: "Recorder", url: "/recorder", icon: Music2 },
];

const authNavItems = [
  { name: "Sign In", url: "/signin", icon: User },
  { name: "Sign Up", url: "/signup", icon: UserRoundPlus },
];

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState("");
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems = user ? defaultNavItems : [...defaultNavItems, ...authNavItems];

  useEffect(() => {
    // Set active tab based on current path
    const path = window.location.pathname;
    const currentItem = navItems.find(item => item.url === path);
    if (currentItem) {
      setActiveTab(currentItem.name);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-4 w-full pointer-events-none",
        className
      )}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between gap-3 bg-white/10 dark:bg-zinc-900/40 border border-white/10 dark:border-zinc-800/40 backdrop-blur-lg py-2 px-4 rounded-2xl shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-blue-600/20 dark:bg-blue-500/20 rounded-xl">
                <Music className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-lg font-semibold text-zinc-900 dark:text-white">Karokini</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative flex items-center gap-2 cursor-pointer text-sm font-medium px-4 py-2 rounded-xl transition-colors",
                    "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white",
                    isActive && "text-zinc-900 dark:text-white"
                  )}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span className="hidden sm:inline">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/10 dark:bg-zinc-800/40 rounded-xl -z-[1]"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <LogOut size={18} strokeWidth={2} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
