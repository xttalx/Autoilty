import { NextRequest, NextResponse } from 'next/server';
import { validateCountryCode, handleApiError, ApiError, validatePagination } from '@/lib/api/errors';
import { ForumThread, ForumPost } from '@/types/forum';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase/client';

// GET: Fetch thread with posts
export async function GET(
  request: NextRequest,
  { params }: { params: { country: string; thread: string } }
) {
  try {
    const { country, thread: threadId } = params;

    if (!validateCountryCode(country)) {
      throw new ApiError(`Invalid country code: ${country}`, 400, 'INVALID_COUNTRY');
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = validatePagination(
      searchParams.get('page') || undefined,
      searchParams.get('limit') || undefined
    );

    // In production, use Supabase query:
    /*
    // Fetch thread
    const { data: thread, error: threadError } = await supabaseAdmin
      .from('forum_threads')
      .select(`
        *,
        user:forum_users(id, username, email, avatar, join_date, post_count)
      `)
      .eq('id', threadId)
      .eq('country', country)
      .single();

    if (threadError || !thread) {
      throw new ApiError('Thread not found', 404, 'THREAD_NOT_FOUND');
    }

    // Increment view count
    await supabaseAdmin.rpc('increment_thread_views', { thread_id: threadId });

    // Fetch posts (root posts only for pagination)
    const rootPostsQuery = supabaseAdmin
      .from('forum_posts')
      .select('*', { count: 'exact' })
      .eq('thread_id', threadId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    rootPostsQuery.range(from, to);

    const { data: rootPosts, error: postsError, count } = await rootPostsQuery;

    if (postsError) throw postsError;

    // Fetch replies for each root post
    if (rootPosts && rootPosts.length > 0) {
      const postIds = rootPosts.map((p) => p.id);
      
      const { data: replies, error: repliesError } = await supabaseAdmin
        .from('forum_posts')
        .select(`
          *,
          user:forum_users(id, username, email, avatar, join_date, post_count)
        `)
        .in('parent_id', postIds)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;

      // Attach replies to parent posts
      rootPosts.forEach((post) => {
        (post as any).replies = replies?.filter((r) => r.parent_id === post.id) || [];
      });
    }

    return NextResponse.json({
      thread,
      posts: rootPosts || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
    */

    // Mock implementation
    const mockThread: ForumThread = {
      id: threadId,
      title: 'Best car for Singapore roads?',
      content: 'Looking for recommendations on a reliable car that handles Singapore\'s road conditions well.',
      category: 'buying',
      country: country as CountryCode,
      userId: 'user1',
      user: {
        id: 'user1',
        username: 'CarEnthusiast',
        email: 'user@example.com',
        joinDate: '2024-01-15',
        postCount: 45,
      },
      createdAt: '2024-11-15T10:00:00Z',
      viewCount: 235,
      postCount: 13,
      tags: ['singapore', 'buying-advice'],
    };

    const mockPosts: ForumPost[] = [
      {
        id: 'post_1',
        threadId,
        userId: 'user2',
        user: {
          id: 'user2',
          username: 'AutoGuru',
          email: 'guru@example.com',
          joinDate: '2023-06-20',
          postCount: 156,
        },
        content: 'I\'d recommend the Toyota Vios or Honda City for that budget. Both are very reliable.',
        createdAt: '2024-11-15T11:00:00Z',
        likes: 8,
      },
      {
        id: 'post_2',
        threadId,
        userId: 'user3',
        user: {
          id: 'user3',
          username: 'CarExpert',
          email: 'expert@example.com',
          joinDate: '2023-03-10',
          postCount: 89,
        },
        content: 'Agreed! The Vios is excellent for Singapore roads.',
        parentId: 'post_1',
        createdAt: '2024-11-15T11:30:00Z',
        likes: 3,
      },
    ];

    const rootPosts = mockPosts.filter((p) => !p.parentId);
    const total = rootPosts.length;

    return NextResponse.json(
      {
        thread: mockThread,
        posts: rootPosts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    const { status, message } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// POST: Create new post in thread
export async function POST(
  request: NextRequest,
  { params }: { params: { country: string; thread: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new ApiError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { country, thread: threadId } = params;

    if (!validateCountryCode(country)) {
      throw new ApiError(`Invalid country code: ${country}`, 400, 'INVALID_COUNTRY');
    }

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || !content.trim()) {
      throw new ApiError('Content is required', 400, 'MISSING_CONTENT');
    }

    // In production, use Supabase query:
    /*
    // Verify thread exists and belongs to country
    const { data: thread, error: threadError } = await supabaseAdmin
      .from('forum_threads')
      .select('id, is_locked')
      .eq('id', threadId)
      .eq('country', country)
      .single();

    if (threadError || !thread) {
      throw new ApiError('Thread not found', 404, 'THREAD_NOT_FOUND');
    }

    if (thread.is_locked) {
      throw new ApiError('Thread is locked', 403, 'THREAD_LOCKED');
    }

    // Verify parent post exists if replying
    if (parentId) {
      const { data: parentPost, error: parentError } = await supabaseAdmin
        .from('forum_posts')
        .select('id, thread_id')
        .eq('id', parentId)
        .eq('thread_id', threadId)
        .single();

      if (parentError || !parentPost) {
        throw new ApiError('Parent post not found', 404, 'PARENT_NOT_FOUND');
      }
    }

    // Insert post
    const { data: post, error: postError } = await supabaseAdmin
      .from('forum_posts')
      .insert({
        thread_id: threadId,
        user_id: session.user.id,
        content: content.trim(),
        parent_id: parentId || null,
        likes: 0,
        is_edited: false,
      })
      .select(`
        *,
        user:forum_users(id, username, email, avatar, join_date, post_count)
      `)
      .single();

    if (postError) throw postError;

    // Increment post count on thread
    await supabaseAdmin.rpc('increment_thread_post_count', { thread_id: threadId });

    return NextResponse.json(post, { status: 201 });
    */

    // Mock implementation
    const mockPost: ForumPost = {
      id: `post_${Date.now()}`,
      threadId,
      userId: session.user.id,
      user: {
        id: session.user.id,
        username: session.user.username || session.user.name || 'User',
        email: session.user.email || '',
        joinDate: new Date().toISOString(),
      },
      content: content.trim(),
      parentId: parentId || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    return NextResponse.json(mockPost, { status: 201 });
  } catch (error) {
    const { status, message } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

