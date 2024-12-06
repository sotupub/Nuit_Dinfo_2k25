"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { useTheme } from "next-themes";
import { Sun, Moon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      </div>
      <div className="relative z-10">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={window.location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto py-6"
          >
            <div className="glass-effect rounded-lg p-6 shadow-lg">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
        <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
          <div className="container mx-auto">
            <p> {new Date().getFullYear()} CyberSafe Hub. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
