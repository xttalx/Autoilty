'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ForumThread } from '@/types/forum';
import { CountryCode } from '@/lib/countries';
import { formatRelativeTime } from '@/lib/utils/format';

interface ForumThreadListProps {
  threads: ForumThread[];
  country: CountryCode;
  className?: string;
}

export default function ForumThreadList({ threads, country, className = '' }: ForumThreadListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {threads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No threads yet. Start a discussion!</p>
        </div>
      ) : (
        threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/forums/${thread.id}`}
            className="block bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Mobile: Stack everything */}
              <div className="flex-1 sm:flex-none sm:w-full">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0">
                    {thread.user.avatar ? (
                      <Image
                        src={thread.user.avatar}
                        alt={thread.user.username}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                        {thread.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 hover:text-primary transition-colors">
                      {thread.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
                      <span>{thread.user.username}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(thread.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Tags and badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {thread.isPinned && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                      📌 Pinned
                    </span>
                  )}
                  {thread.isLocked && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                      🔒 Locked
                    </span>
                  )}
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {thread.category}
                  </span>
                  {thread.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Preview */}
                <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3">
                  {thread.content}
                </p>
              </div>

              {/* Desktop: Stats on the right */}
              <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 sm:min-w-[120px] sm:ml-4">
                <div className="text-center sm:text-right">
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    {thread.postCount}
                  </div>
                  <div className="text-xs text-gray-500">posts</div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    {thread.viewCount}
                  </div>
                  <div className="text-xs text-gray-500">views</div>
                </div>
                {thread.lastPost && (
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-gray-600">
                      Last by {thread.lastPost.user.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRelativeTime(thread.lastPost.createdAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

