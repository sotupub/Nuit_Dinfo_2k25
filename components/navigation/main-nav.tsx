"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, LockKeyhole, User, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from 'react';
import Image from 'next/image';

const menuItems = [
  { href: "/scenarios", title: "Scénarios", requireAuth: true },
  { href: "/chat", title: "Assistant IA", requireAuth: true },
  { href: "/videos", title: "Vidéos", requireAuth: false },
  { href: "/quiz", title: "Quiz", requireAuth: true },
  { href: "/dashboard", title: "Tableau de Bord", requireAuth: true },
  { href: "/progress", title: "Progression", requireAuth: true }
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  // Debug log for user state
  useEffect(() => {
    console.log('MainNav - Auth State:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="hover-ripple"
        />
        <span className="hidden font-bold sm:inline-block">
          CyberSafe Hub
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {menuItems.map((item, index) => (
          (!item.requireAuth || isAuthenticated) && (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary hover-ripple relative",
                pathname === item.href
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary water-ripple"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          )
        ))}
      </nav>
      <div className="flex items-center space-x-4 ml-auto">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-9 w-9"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium">
                {user?.name || 'User'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/login')}
            >
              Connexion
            </Button>
            <Button 
              onClick={() => router.push('/register')}
            >
              Inscription
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}