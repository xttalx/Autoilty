'use client';

import { useState, useEffect } from 'react';
import { CountryCode, countries, getCountryConfig } from '@/lib/countries';
import { SearchFilters as SearchFiltersType } from '@/types';

interface SearchFiltersProps {
  country: CountryCode;
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  className?: string;
}

export default function SearchFilters({
  country,
  filters,
  onFiltersChange,
  className = '',
}: SearchFiltersProps) {
  const countryConfig = getCountryConfig(country);
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters);

  // Popular makes based on country
  const popularMakes = countryConfig.popularBrands;
  
  // Categories from country config
  const categories = countryConfig.categories;

  // Fuel types (common across countries)
  const fuelTypes = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'plug-in-hybrid', label: 'Plug-in Hybrid' },
  ];

  // Transmission types
  const transmissionTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'cvt', label: 'CVT' },
  ];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFiltersType, value: string | number | undefined) => {
    const updatedFilters = {
      ...localFilters,
      [key]: value === '' ? undefined : value,
    };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFiltersType = {
      country,
      page: 1,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    (key) => key !== 'country' && key !== 'page' && localFilters[key as keyof SearchFiltersType] !== undefined
  );

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Search Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Make Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <select
            value={localFilters.make || ''}
            onChange={(e) => handleFilterChange('make', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="">All Makes</option>
            {popularMakes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Model Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            value={localFilters.model || ''}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            placeholder="Any model"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Year
          </label>
          <input
            type="number"
            value={localFilters.minYear || ''}
            onChange={(e) => handleFilterChange('minYear', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="e.g. 2020"
            min="1990"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Year
          </label>
          <input
            type="number"
            value={localFilters.maxYear || ''}
            onChange={(e) => handleFilterChange('maxYear', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="e.g. 2024"
            min="1990"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <select
            value={localFilters.fuelType || ''}
            onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="">All Types</option>
            {fuelTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission
          </label>
          <select
            value={localFilters.transmission || ''}
            onChange={(e) => handleFilterChange('transmission', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="">All Types</option>
            {transmissionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={localFilters.sortBy || 'newest'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Year: Newest First</option>
            <option value="mileage_asc">Mileage: Low to High</option>
          </select>
        </div>
      </div>
    </div>
  );
}

