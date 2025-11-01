/**
 * Lazy Loading Listings Component
 * Implements Intersection Observer for performance
 */

'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyListingsProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyListings({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
}: LazyListingsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-64 w-full" />
        </div>
      )}
    </div>
  );
}

/**
 * Lazy loaded listing grid item
 */
interface LazyListingItemProps {
  children: ReactNode;
  index?: number;
}

export function LazyListingItem({ children, index = 0 }: LazyListingItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load first 8 items immediately
    if (index < 8) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [index]);

  return (
    <div ref={ref}>
      {isVisible ? children : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

