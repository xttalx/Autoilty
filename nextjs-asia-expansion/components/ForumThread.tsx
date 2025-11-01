'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ForumThread as ForumThreadType, ForumPost, ForumUser } from '@/types/forum';
import { CountryCode } from '@/lib/countries';
import { getForumPlaceholder } from '@/lib/utils/forum-placeholders';
import { formatRelativeTime } from '@/lib/utils/format';
import { useSession } from 'next-auth/react';

interface ForumThreadProps {
  thread: ForumThreadType;
  country: CountryCode;
  posts?: ForumPost[];
  onPostSubmit?: (content: string, parentId?: string) => Promise<void>;
}

export default function ForumThread({ thread, country, posts = [], onPostSubmit }: ForumThreadProps) {
  const { data: session } = useSession();
  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localPosts, setLocalPosts] = useState<ForumPost[]>(posts);

  // Build threaded structure
  const rootPosts = localPosts.filter((post) => !post.parentId);
  const getReplies = (postId: string): ForumPost[] => {
    return localPosts.filter((post) => post.parentId === postId);
  };

  const handleSubmitPost = async () => {
    if (!session || !newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      if (onPostSubmit) {
        await onPostSubmit(newPostContent);
        setNewPostContent('');
        // In production, refresh posts from API
        // For now, add mock post
        const mockPost: ForumPost = {
          id: `post_${Date.now()}`,
          threadId: thread.id,
          userId: session.user?.id || 'user1',
          user: {
            id: session.user?.id || 'user1',
            username: session.user?.name || 'You',
            email: session.user?.email || '',
            avatar: session.user?.image,
          },
          content: newPostContent,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        setLocalPosts([...localPosts, mockPost]);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      if (onPostSubmit) {
        await onPostSubmit(replyContent, parentId);
        setReplyContent('');
        setReplyingTo(null);
        // In production, refresh posts from API
        const mockReply: ForumPost = {
          id: `reply_${Date.now()}`,
          threadId: thread.id,
          userId: session.user?.id || 'user1',
          user: {
            id: session.user?.id || 'user1',
            username: session.user?.name || 'You',
            email: session.user?.email || '',
            avatar: session.user?.image,
          },
          content: replyContent,
          parentId,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        setLocalPosts([...localPosts, mockReply]);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PostCard = ({ post, depth = 0 }: { post: ForumPost; depth?: number }) => {
    const replies = getReplies(post.id);
    const isMaxDepth = depth >= 3; // Limit nesting depth

    return (
      <div className={`${depth > 0 ? 'ml-4 sm:ml-8 md:ml-12 pl-4 sm:pl-6 border-l-2 border-gray-200' : ''}`}>
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 shadow-sm">
          {/* Post Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-3">
            <div className="flex-shrink-0">
              {post.user.avatar ? (
                <Image
                  src={post.user.avatar}
                  alt={post.user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {post.user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${post.user.id}`}
                  className="font-semibold text-gray-900 hover:text-primary"
                >
                  {post.user.username}
                </Link>
                <span className="text-xs sm:text-sm text-gray-500">
                  {formatRelativeTime(post.createdAt)}
                </span>
                {post.isEdited && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>
              {post.user.postCount && (
                <div className="text-xs text-gray-500 mt-1">
                  {post.user.postCount} posts
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-sm max-w-none mb-4">
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                // Like functionality
                console.log('Like post', post.id);
              }}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{post.likes || 0}</span>
            </button>
            {session && !isMaxDepth && (
              <button
                onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === post.id && session && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={getForumPlaceholder(country, thread.category)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm sm:text-base"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSubmitReply(post.id)}
                  disabled={!replyContent.trim() || isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {replies.length > 0 && !isMaxDepth && (
            <div className="mt-4">
              {replies.map((reply) => (
                <PostCard key={reply.id} post={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Thread Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {thread.isPinned && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                  Pinned
                </span>
              )}
              {thread.isLocked && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                  Locked
                </span>
              )}
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                {thread.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {thread.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-2">
                {thread.user.avatar ? (
                  <Image
                    src={thread.user.avatar}
                    alt={thread.user.username}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    {thread.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <Link
                  href={`/profile/${thread.user.id}`}
                  className="hover:text-primary font-medium"
                >
                  {thread.user.username}
                </Link>
              </div>
              <span>{formatRelativeTime(thread.createdAt)}</span>
              <span>{thread.viewCount} views</span>
              <span>{thread.postCount} posts</span>
            </div>
          </div>
        </div>

        {/* Thread Content */}
        <div className="prose max-w-none mb-4">
          <p className="text-gray-800 whitespace-pre-wrap">{thread.content}</p>
        </div>

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="mb-6">
        {rootPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No posts yet. Be the first to reply!</p>
          </div>
        ) : (
          rootPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* New Post Form */}
      {session ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Post a Reply</h2>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={getForumPlaceholder(country, thread.category)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm sm:text-base"
            rows={6}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmitPost}
              disabled={!newPostContent.trim() || isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Please log in to post a reply</p>
          <Link
            href="/api/auth/signin"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
}

