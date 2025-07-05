'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth-modal';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { user, isPro } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Hide header on workbench route
  if (pathname === '/workbench') {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Workbench', href: '/workbench' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="font-bold text-xl">Cutlist</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              {isPro && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Pro
                </Badge>
              )}
              <Link href="/account">
                <Button variant="outline" size="sm">
                  Account
                </Button>
              </Link>
            </div>
          ) : (
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t space-y-4">
                {user ? (
                  <div className="space-y-2">
                    {isPro && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Pro Account
                      </Badge>
                    )}
                    <Link href="/account">
                      <Button variant="outline" size="sm" className="w-full">
                        Account
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => setAuthModalOpen(true)}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  );
}
