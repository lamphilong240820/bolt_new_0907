'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';

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

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      });

      const response = await fetch(`/api/products?${params}`);
      const data: ProductsResponse = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Page Header */}
        <div className="mb-8 relative animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-800">Product Catalog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
            {filters.search ? `Search results for "${filters.search}"` : 'All Products'}
          </h1>
          <p className="text-lg text-gray-600">
            {isLoading ? 'Loading products...' : `${pagination.total} products found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden hover:scale-105 transition-transform duration-300"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                <div className="hidden sm:flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <ProductSort
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={(sortBy, sortOrder) => 
                  handleFilterChange({ sortBy, sortOrder })
                }
              />
            </div>

            {/* Products Grid */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <ProductGrid
                products={products}
                loading={loading}
                viewMode={viewMode}
              />
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex flex-col items-center space-y-4">
                  {/* Page Info */}
                  <div className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    {(() => {
                      const currentPage = pagination.page;
                      const totalPages = pagination.pages;
                      const delta = 2; // Number of pages to show on each side of current page
                      
                      let pages = [];
                      
                      // Always show first page
                      if (currentPage > delta + 1) {
                        pages.push(1);
                        if (currentPage > delta + 2) {
                          pages.push('...');
                        }
                      }
                      
                      // Show pages around current page
                      for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
                        pages.push(i);
                      }
                      
                      // Always show last page
                      if (currentPage < totalPages - delta) {
                        if (currentPage < totalPages - delta - 1) {
                          pages.push('...');
                        }
                        pages.push(totalPages);
                      }
                      
                      return pages.map((page, index) => {
                        if (page === '...') {
                          return (
                            <span key={index} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            className={`w-10 hover:scale-105 transition-transform duration-300 ${
                              page === currentPage 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                                : 'border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                            onClick={() => handlePageChange(page as number)}
                          >
                            {page}
                          </Button>
                        );
                      });
                    })()}
                    
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      Next
                    </Button>
                  </div>
                  
                  {/* Items per page selector */}
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Items per page:</span>
                    <select
                      value={pagination.limit}
                      onChange={(e) => {
                        setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                      <option value={96}>96</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}