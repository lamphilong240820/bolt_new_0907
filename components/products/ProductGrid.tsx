'use client';

import Link from 'next/link';
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  viewMode: 'grid' | 'list';
}

export default function ProductGrid({ products, loading, viewMode }: ProductGridProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (products.length > 0) {
      setVisibleProducts(new Array(products.length).fill(false));
      
      // Animate products in sequence
      products.forEach((_, index) => {
        setTimeout(() => {
          setVisibleProducts(prev => {
            const newVisible = [...prev];
            newVisible[index] = true;
            return newVisible;
          });
        }, index * 100);
      });
    }
  }, [products]);

  const handleAddToCart = async (productId: string) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      router.push('/auth/signin');
      return;
    }

    setAddingToCart(productId);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart successfully.",
        });
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to add item to cart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const getBadgeText = (product: Product) => {
    if (product.comparePrice && product.comparePrice > product.price) {
      const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
      return `${discount}% OFF`;
    }
    if (product.reviewCount > 100) {
      return "Best Seller";
    }
    return "New";
  };

  const getBadgeColor = (product: Product) => {
    if (product.comparePrice && product.comparePrice > product.price) {
      return 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600';
    }
    if (product.reviewCount > 100) {
      return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600';
    }
    return 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600';
  };

  if (loading) {
    return (
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse hover-lift">
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-shimmer" />
            <CardContent className="p-4">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-shimmer" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 mb-2 animate-shimmer" />
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 animate-shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">We couldn't find any products matching your criteria. Try adjusting your filters or search terms.</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <Card 
            key={product.id} 
            className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative transform ${
              visibleProducts[index] 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" style={{ padding: '2px' }}>
              <div className="bg-white rounded-lg h-full w-full" />
            </div>

            <div className="flex relative">
              <div className="w-48 h-48 relative overflow-hidden">
                <div className="relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                  <img
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Animated overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                
                {/* Enhanced Badge */}
                <Badge 
                  className={`absolute top-3 left-3 ${getBadgeColor(product)} text-white border-0 shadow-lg transform group-hover:scale-110 transition-all duration-300`}
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="font-medium">{getBadgeText(product)}</span>
                  </div>
                </Badge>

                {/* Enhanced Wishlist button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-200"
                >
                  <Heart className="w-4 h-4 transition-transform duration-300 hover:scale-125" />
                </Button>
              </div>
              
              <CardContent className="flex-1 p-6 relative">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
                      {product.description}
                    </p>
                    
                    {/* Enhanced Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 transition-all duration-300 hover:scale-125 ${
                              star <= Math.floor(product.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        {product.averageRating} ({product.reviewCount} reviews)
                      </span>
                    </div>
                    
                    {/* Enhanced Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.comparePrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Animated stock indicator */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                      <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
                        {product.stock > 0 ? (
                          product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock'
                        ) : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:scale-110 transition-transform duration-300 border border-gray-200 hover:border-red-300 hover:bg-red-50"
                    >
                      <Heart className="w-4 h-4 hover:text-red-500 transition-colors duration-300" />
                    </Button>
                    <Button 
                      disabled={product.stock === 0 || addingToCart === product.id}
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                      {addingToCart === product.id ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Card 
          key={product.id} 
          className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative transform ${
            visibleProducts[index] 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-8 opacity-0 scale-95'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" style={{ padding: '2px' }}>
            <div className="bg-white rounded-lg h-full w-full" />
          </div>

          <div className="relative overflow-hidden">
            <div className="relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
              <Link href={`/products/${product.slug}`}>
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              {/* Animated overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
            
            {/* Enhanced Badge */}
            <Badge 
              className={`absolute top-3 left-3 ${getBadgeColor(product)} text-white border-0 shadow-lg transform group-hover:scale-110 transition-all duration-300`}
            >
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="font-medium">{getBadgeText(product)}</span>
              </div>
            </Badge>

            {/* Enhanced Wishlist button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg border border-gray-200"
            >
              <Heart className="w-4 h-4 transition-transform duration-300 hover:scale-125" />
            </Button>

            {/* Enhanced Quick add to cart */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg group/btn border border-white/20"
                onClick={() => handleAddToCart(product.id)}
                disabled={addingToCart === product.id || product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                {addingToCart === product.id ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          <CardContent className="p-4 relative">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                {product.name}
              </h3>
            </Link>
            
            {/* Enhanced Rating */}
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 transition-all duration-300 hover:scale-125 ${
                      star <= Math.floor(product.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                {product.averageRating} ({product.reviewCount})
              </span>
            </div>

            {/* Enhanced Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                ${product.price}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.comparePrice}
                </span>
              )}
            </div>
            
            {/* Enhanced status indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
                  {product.stock > 0 ? (
                    product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock'
                  ) : 'Out of Stock'}
                </Badge>
              </div>
              {product.comparePrice && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}