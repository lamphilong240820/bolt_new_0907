'use client';

import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
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
  const { toast } = useToast();

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
  if (loading) {
    return (
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ShoppingCart className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex">
              <div className="w-48 h-48 relative overflow-hidden">
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.comparePrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <CardContent className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(product.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.averageRating} ({product.reviewCount} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.comparePrice}
                        </span>
                      )}
                    </div>
                    
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button disabled={product.stock === 0}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
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
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
          <div className="relative overflow-hidden">
            <Link href={`/products/${product.slug}`}>
              <img
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </Link>
            
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all border border-gray-200 shadow-sm"
              <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white border-0">
                {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all border border-gray-200 shadow-sm"
            >
              <Heart className="w-4 h-4" />
            </Button>

            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                className="w-full bg-white text-gray-900 hover:bg-gray-100"
                disabled={product.stock === 0}
                onClick={() => handleAddToCart(product.id)}
              >
                {addingToCart === product.id ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(product.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.averageRating} ({product.reviewCount})
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.comparePrice}
                </span>
              )}
            </div>
            
            <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}