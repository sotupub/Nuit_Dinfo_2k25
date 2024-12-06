"use client";

import { MainNav } from "@/components/navigation/main-nav";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
    }
  }, [setTheme]);

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
        <main className="container mx-auto py-6">
          <div className="glass-effect rounded-lg p-6 shadow-lg">
            {children}
          </div>
        </main>
        <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
          <div className="container mx-auto">
            <p>© {new Date().getFullYear()} CyberSafe Hub. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
