'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface DiscussionButtonProps {
  listingId: string;
  threadId?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'text';
}

export default function DiscussionButton({
  listingId,
  threadId,
  className = '',
  variant = 'default',
}: DiscussionButtonProps) {
  const { t } = useTranslation();
  const href = threadId ? `/forums/${threadId}` : `/forums/new?listingId=${listingId}`;

  const baseClasses = 'inline-flex items-center gap-2 font-medium transition-colors text-sm sm:text-base';
  
  const variantClasses = {
    default: 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark',
    outline: 'px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10',
    text: 'text-primary hover:text-primary-dark underline',
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      {threadId ? 'View Discussion' : 'Start Discussion'}
    </Link>
  );
}

