'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/types';
import DirectoryListing from './DirectoryListing';
import { CountryCode } from '@/lib/countries';

interface DealCarouselProps {
  deals: Listing[];
  country: CountryCode;
  title?: string;
}

export default function DealCarousel({ deals, country, title = 'Best Deals' }: DealCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1280) {
        setItemsToShow(4);
      } else if (window.innerWidth >= 1024) {
        setItemsToShow(3);
      } else if (window.innerWidth >= 640) {
        setItemsToShow(2);
      } else {
        setItemsToShow(1);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  if (!deals || deals.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, deals.length - itemsToShow);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleDeals = deals.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous deals"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next deals"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            }}
          >
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex-shrink-0 px-2 sm:px-3"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <DirectoryListing listing={deal} country={country} />
              </div>
            ))}
          </div>
        </div>

        {/* Indicator Dots */}
        {deals.length > itemsToShow && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(deals.length / itemsToShow) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsToShow)}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / itemsToShow) === index
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

