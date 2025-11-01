'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ForumThreadList from '@/components/ForumThreadList';
import { ForumThread } from '@/types/forum';
import { CountryCode } from '@/lib/countries';
import { useSession } from 'next-auth/react';
import { getForumPlaceholder } from '@/lib/utils/forum-placeholders';

// Mock API - Replace with real API call
async function fetchThreads(country: CountryCode): Promise<ForumThread[]> {
  // In production, fetch from Supabase/API
  return [
    {
      id: 'thread1',
      title: 'Best car for Singapore roads?',
      content: 'Looking for recommendations...',
      category: 'buying',
      country,
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
    },
  ];
}

export default function ForumsPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const country: CountryCode = 'SG'; // In production, get from context
  
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      try {
        const data = await fetchThreads(country);
        setThreads(data);
      } catch (error) {
        console.error('Error loading threads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThreads();
  }, [country]);

  const handleCreateThread = async () => {
    if (!session || !newThreadTitle.trim() || !newThreadContent.trim()) return;

    // In production, call Supabase/API
    console.log('Creating thread:', { newThreadTitle, newThreadContent, selectedCategory });
    
    // Mock: Add to local state
    const mockThread: ForumThread = {
      id: `thread_${Date.now()}`,
      title: newThreadTitle,
      content: newThreadContent,
      category: selectedCategory,
      country,
      userId: session.user?.id || 'user1',
      user: {
        id: session.user?.id || 'user1',
        username: session.user?.username || session.user?.name || 'You',
        email: session.user?.email || '',
        joinDate: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      viewCount: 0,
      postCount: 0,
    };
    
    setThreads([mockThread, ...threads]);
    setNewThreadTitle('');
    setNewThreadContent('');
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
              <p className="text-gray-600">Discuss cars, share experiences, get advice</p>
            </div>
            {session && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                {showCreateForm ? 'Cancel' : '+ New Thread'}
              </button>
            )}
          </div>
        </div>

        {/* Create Thread Form */}
        {showCreateForm && session && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Thread</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="general">General Discussion</option>
                  <option value="buying">Buying & Selling</option>
                  <option value="maintenance">Maintenance & Repair</option>
                  <option value="modifications">Modifications</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Enter thread title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  placeholder={getForumPlaceholder(country, selectedCategory)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
              <button
                onClick={handleCreateThread}
                disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Create Thread
              </button>
            </div>
          </div>
        )}

        {/* Threads List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading threads...</p>
          </div>
        ) : (
          <ForumThreadList threads={threads} country={country} />
        )}
      </div>
    </div>
  );
}

