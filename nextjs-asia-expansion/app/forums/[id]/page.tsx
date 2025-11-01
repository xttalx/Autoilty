'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ForumThread from '@/components/ForumThread';
import { ForumThread as ForumThreadType, ForumPost } from '@/types/forum';
import { CountryCode } from '@/lib/countries';

// Mock API - Replace with real API call
async function fetchThread(id: string): Promise<ForumThreadType | null> {
  // In production, fetch from Supabase/API
  return {
    id,
    title: 'Best car for Singapore roads?',
    content: 'Looking for recommendations on a reliable car that handles Singapore\'s road conditions well. Budget around S$80,000.',
    category: 'buying',
    country: 'SG' as CountryCode,
    userId: 'user1',
    user: {
      id: 'user1',
      username: 'CarEnthusiast',
      email: 'user@example.com',
      joinDate: '2024-01-15',
      postCount: 45,
    },
    createdAt: '2024-11-15T10:00:00Z',
    viewCount: 234,
    postCount: 12,
    tags: ['singapore', 'buying-advice'],
  };
}

async function fetchPosts(threadId: string): Promise<ForumPost[]> {
  // In production, fetch from Supabase/API
  return [
    {
      id: 'post1',
      threadId,
      userId: 'user2',
      user: {
        id: 'user2',
        username: 'AutoGuru',
        email: 'guru@example.com',
        joinDate: '2023-06-20',
        postCount: 156,
      },
      content: 'I\'d recommend the Toyota Vios or Honda City for that budget. Both are very reliable and have good resale value in Singapore.',
      createdAt: '2024-11-15T11:00:00Z',
      likes: 8,
    },
  ];
}

export default function ForumThreadPage() {
  const params = useParams();
  const threadId = params.id as string;
  const country: CountryCode = 'SG'; // In production, get from context/params
  
  const [thread, setThread] = useState<ForumThreadType | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [threadData, postsData] = await Promise.all([
          fetchThread(threadId),
          fetchPosts(threadId),
        ]);
        setThread(threadData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading thread:', error);
      } finally {
        setLoading(false);
      }
    };

    if (threadId) {
      loadData();
    }
  }, [threadId]);

  const handlePostSubmit = async (content: string, parentId?: string) => {
    // In production, call Supabase/API
    console.log('Submitting post:', { content, parentId, threadId });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading thread...</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Thread not found</h1>
        <p className="text-gray-600">The thread you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <ForumThread
      thread={thread}
      country={country}
      posts={posts}
      onPostSubmit={handlePostSubmit}
    />
  );
}

