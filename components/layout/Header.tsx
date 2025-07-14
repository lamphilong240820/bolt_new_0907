'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  ShoppingCart,
  Heart,
  Package,
  Settings,
  LogOut,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggle from '@/components/ui/theme-toggle';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Electronics', href: '/electronics' },
  { name: 'Fashion', href: '/fashion' },
  { name: 'Home & Garden', href: '/home' },
  { name: 'Sports', href: '/sports' },
];

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (session) {
      fetchCartCount();
    }
  }, [session]);

  useEffect(() => {
    const handleCartUpdate = () => {
      if (session) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [session]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-white border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animation */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent hidden sm:block group-hover:scale-105 transition-transform duration-300">
              ShopFlow
            </span>
          </Link>

          {/* Desktop Navigation with hover effects */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  pathname === item.href 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform transition-all duration-300 ${
                  pathname === item.href 
                    ? 'scale-x-100' 
                    : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors duration-300" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none" />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:scale-110 transition-transform duration-300 border-gray-300 hover:bg-gray-100">
                  <Search className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Search Products</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 w-full"
                      autoFocus
                    />
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Enhanced Cart with animation */}
            {session && (
              <Link href="/cart">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="relative group hover:scale-110 transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">
                      {cartCount > 99 ? '99+' : cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Enhanced User Menu */}
            <ThemeToggle />
            
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors duration-300">
                      {session.user?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Customer Menu Items */}
                  {session.user.role === 'CUSTOMER' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center group">
                          <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/orders" className="flex items-center group">
                          <History className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Order History</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/cart" className="flex items-center group">
                          <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Shopping Cart</span>
                          {cartCount > 0 && (
                            <Badge className="ml-auto" variant="secondary">
                              {cartCount}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Admin Menu Items */}
                  {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center group">
                          <Package className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/orders" className="flex items-center group">
                          <History className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>My Order History</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/cart" className="flex items-center group">
                          <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Shopping Cart</span>
                          {cartCount > 0 && (
                            <Badge className="ml-auto" variant="secondary">
                              {cartCount}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="group">
                    <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Enhanced Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="lg:hidden hover:scale-110 transition-transform duration-300"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <span>ShopFlow</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                          pathname === item.href
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile User Actions */}
                  {session ? (
                    <div className="pt-4 border-t space-y-2">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                      
                      {session.user.role === 'CUSTOMER' && (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 group"
                          >
                            <User className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 group"
                          >
                            <History className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            Order History
                          </Link>
                          <Link
                            href="/cart"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 group"
                          >
                            <ShoppingCart className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            Shopping Cart
                            {cartCount > 0 && (
                              <Badge className="ml-auto" variant="secondary">
                                {cartCount}
                              </Badge>
                            )}
                          </Link>
                        </>
                      )}

                      {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 group"
                          >
                            <Package className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            Admin Dashboard
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 group"
                          >
                            <History className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            My Order History
                          </Link>
                          <Link
                            href="/cart"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300 group"
                          >
                            <ShoppingCart className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            Shopping Cart
                            {cartCount > 0 && (
                              <Badge className="ml-auto" variant="secondary">
                                {cartCount}
                              </Badge>
                            )}
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-300 group"
                      >
                        <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t space-y-2">
                      <Link
                        href="/auth/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}