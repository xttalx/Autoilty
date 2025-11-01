import { NextRequest, NextResponse } from 'next/server';
import { validateCountryCode, validatePagination, handleApiError, ApiError } from '@/lib/api/errors';
import { ForumThread } from '@/types/forum';
import { CountryCode } from '@/lib/countries';
import { supabaseAdmin } from '@/lib/supabase/client';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params;

    if (!validateCountryCode(country)) {
      throw new ApiError(`Invalid country code: ${country}`, 400, 'INVALID_COUNTRY');
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const { page, limit } = validatePagination(
      searchParams.get('page') || undefined,
      searchParams.get('limit') || undefined
    );

    // In production, use Supabase query:
    /*
    let query = supabaseAdmin
      .from('forum_threads')
      .select(`
        *,
        user:forum_users(id, username, email, avatar, join_date, post_count),
        last_post:forum_posts(
          id,
          user:forum_users(username),
          created_at
        )
      `, { count: 'exact' })
      .eq('country', country)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      threads: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
    */

    // Mock implementation
    const mockThreads: ForumThread[] = [
      {
        id: 'thread_1',
        title: 'Best car for Singapore roads?',
        content: 'Looking for recommendations...',
        category: category || 'general',
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
        viewCount: 234,
        postCount: 12,
        tags: ['singapore', 'buying-advice'],
      },
    ];

    const filteredThreads = category
      ? mockThreads.filter((t) => t.category === category)
      : mockThreads;

    const total = filteredThreads.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedThreads = filteredThreads.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        threads: paginatedThreads,
        total,
        page,
        limit,
        totalPages,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    const { status, message } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new ApiError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { country } = params;

    if (!validateCountryCode(country)) {
      throw new ApiError(`Invalid country code: ${country}`, 400, 'INVALID_COUNTRY');
    }

    const body = await request.json();
    const { title, content, category, listingId, tags } = body;

    if (!title || !content || !category) {
      throw new ApiError('Title, content, and category are required', 400, 'MISSING_FIELDS');
    }

    // In production, use Supabase query:
    /*
    const { data, error } = await supabaseAdmin
      .from('forum_threads')
      .insert({
        title: title.trim(),
        content: content.trim(),
        category,
        country,
        user_id: session.user.id,
        listing_id: listingId || null,
        tags: tags || [],
        view_count: 0,
        post_count: 0,
        is_pinned: false,
        is_locked: false,
      })
      .select(`
        *,
        user:forum_users(id, username, email, avatar, join_date)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
    */

    // Mock implementation
    const mockThread: ForumThread = {
      id: `thread_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      country: country as CountryCode,
      userId: session.user.id,
      user: {
        id: session.user.id,
        username: session.user.username || session.user.name || 'User',
        email: session.user.email || '',
        joinDate: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      viewCount: 0,
      postCount: 0,
      tags: tags || [],
      listingId,
    };

    return NextResponse.json(mockThread, { status: 201 });
  } catch (error) {
    const { status, message } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

