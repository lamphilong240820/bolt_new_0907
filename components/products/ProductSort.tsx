'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductSortProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export default function ProductSort({ sortBy, sortOrder, onSortChange }: ProductSortProps) {
  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'popularity-desc', label: 'Most Popular' },
  ];

  const currentValue = `${sortBy}-${sortOrder}`;

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-');
    onSortChange(newSortBy, newSortOrder);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
      <Select value={currentValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-blue-400 transition-colors duration-300 shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}